
import prisma from "../utils/prisma.js";

const isValidId = (id) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

const activityTypes = [
  "WALKING",
  "RUNNING",
  "CYCLING",
  "SWIMMING",
  "STRENGTH_TRAINING",
  "OTHER",
];

const getAccessFilter = (user) => {
  return user.role === "ADMIN"
    ? {}
    : { userId: user.userId };
};

const findAccessibleActivity = async (id, user) => {
  return prisma.activity.findFirst({
    where: {
      id,
      ...getAccessFilter(user),
    },
  });
};

export const createActivity = async (req, res) => {
  try {
    const {
      type,
      durationMinutes,
      distanceKm,
      caloriesBurned,
      notes,
      startedAt,
    } = req.body;

    if (!activityTypes.includes(type)) {
      return res.status(400).json({
        status: "error",
        message: "Некоректний тип активності",
      });
    }

    if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Тривалість повинна бути додатним цілим числом",
      });
    }

    if (
      distanceKm !== undefined &&
      distanceKm !== null &&
      (typeof distanceKm !== "number" ||
        !Number.isFinite(distanceKm) ||
        distanceKm < 0)
    ) {
      return res.status(400).json({
        status: "error",
        message: "Некоректна дистанція",
      });
    }

    if (
      caloriesBurned !== undefined &&
      caloriesBurned !== null &&
      (!Number.isInteger(caloriesBurned) || caloriesBurned < 0)
    ) {
      return res.status(400).json({
        status: "error",
        message: "Некоректна кількість калорій",
      });
    }

    if (notes !== undefined && notes !== null && typeof notes !== "string") {
      return res.status(400).json({
        status: "error",
        message: "Нотатки повинні бути текстом",
      });
    }

    const activityDate = new Date(startedAt);

    if (!startedAt || Number.isNaN(activityDate.getTime())) {
      return res.status(400).json({
        status: "error",
        message: "Некоректна дата активності",
      });
    }

    const activity = await prisma.activity.create({
      data: {
        userId: req.user.userId,
        type,
        durationMinutes,
        distanceKm,
        caloriesBurned,
        notes,
        startedAt: activityDate,
      },
    });

    req.app.get("io")
      .to(`user:${req.user.userId}`)
      .emit("activity:created", activity);

    return res.status(201).json({
      status: "success",
      data: activity,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "error",
      message: "Помилка під час створення активності",
    });
  }
};

export const getActivities = async (req, res) => {
  try {
    const {
      page = "1",
      limit = "10",
      type,
      search,
      from,
      to,
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
      !Number.isInteger(pageNumber) ||
      pageNumber < 1 ||
      !Number.isInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 100
    ) {
      return res.status(400).json({
        status: "error",
        message: "Некоректні параметри пагінації",
      });
    }

    if (type && !activityTypes.includes(type)) {
      return res.status(400).json({
        status: "error",
        message: "Некоректний тип активності",
      });
    }

    const filters = {
      ...getAccessFilter(req.user),
    };

    if (type) {
      filters.type = type;
    }

    if (search) {
      filters.notes = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (from || to) {
      filters.startedAt = {};

      if (from) {
        const fromDate = new Date(from);

        if (Number.isNaN(fromDate.getTime())) {
          return res.status(400).json({
            status: "error",
            message: "Некоректна початкова дата",
          });
        }

        filters.startedAt.gte = fromDate;
      }

      if (to) {
        const toDate = new Date(to);

        if (Number.isNaN(toDate.getTime())) {
          return res.status(400).json({
            status: "error",
            message: "Некоректна кінцева дата",
          });
        }

        filters.startedAt.lte = toDate;
      }

      if (
        filters.startedAt.gte &&
        filters.startedAt.lte &&
        filters.startedAt.gte > filters.startedAt.lte
      ) {
        return res.status(400).json({
          status: "error",
          message: "Початкова дата не може бути пізніше кінцевої",
        });
      }
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where: filters,
        orderBy: {
          startedAt: "desc",
        },
        skip,
        take: limitNumber,
      }),

      prisma.activity.count({
        where: filters,
      }),
    ]);

    res.status(200).json({
      status: "success",
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
      results: activities.length,
      data: activities,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Не вдалося отримати записи активності",
    });
  }
};

export const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        status: "error",
        message: "Некоректний ID активності",
      });
    }

    const activity = await findAccessibleActivity(id, req.user);

    if (!activity) {
      return res.status(404).json({
        status: "error",
        message: "Запис активності не знайдено",
      });
    }

    res.status(200).json({
      status: "success",
      data: activity,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Не вдалося отримати запис активності",
    });
  }
};

export const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      type,
      durationMinutes,
      distanceKm,
      caloriesBurned,
      notes,
      startedAt,
    } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({
        status: "error",
        message: "Некоректний ID активності",
      });
    }

    const existingActivity = await findAccessibleActivity(id, req.user);

    if (!existingActivity) {
      return res.status(404).json({
        status: "error",
        message: "Запис активності не знайдено",
      });
    }

    const data = {};

    if (type !== undefined) {
      if (!activityTypes.includes(type)) {
        return res.status(400).json({
          status: "error",
          message: "Некоректний тип активності",
        });
      }

      data.type = type;
    }

    if (durationMinutes !== undefined) {
      if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
        return res.status(400).json({
          status: "error",
          message: "Некоректна тривалість",
        });
      }

      data.durationMinutes = durationMinutes;
    }

    if (distanceKm !== undefined) {
      if (
        distanceKm !== null &&
        (typeof distanceKm !== "number" ||
          !Number.isFinite(distanceKm) ||
          distanceKm < 0)
      ) {
        return res.status(400).json({
          status: "error",
          message: "Некоректна дистанція",
        });
      }

      data.distanceKm = distanceKm;
    }

    if (caloriesBurned !== undefined) {
      if (
        caloriesBurned !== null &&
        (!Number.isInteger(caloriesBurned) || caloriesBurned < 0)
      ) {
        return res.status(400).json({
          status: "error",
          message: "Некоректна кількість калорій",
        });
      }

      data.caloriesBurned = caloriesBurned;
    }

    if (notes !== undefined) {
      if (notes !== null && typeof notes !== "string") {
        return res.status(400).json({
          status: "error",
          message: "Нотатки повинні бути текстом",
        });
      }

      data.notes = notes;
    }

    if (startedAt !== undefined) {
      const date = new Date(startedAt);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({
          status: "error",
          message: "Некоректна дата",
        });
      }

      data.startedAt = date;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Не вказано даних для оновлення",
      });
    }

    const activity = await prisma.activity.update({
      where: {
        id,
        ...getAccessFilter(req.user),
      },
      data,
    });

    req.app.get("io")
      .to(`user:${activity.userId}`)
      .emit("activity:updated", activity);

    res.status(200).json({
      status: "success",
      data: activity,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        status: "error",
        message: "Запис активності не знайдено",
      });
    }

    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Помилка під час оновлення активності",
    });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        status: "error",
        message: "Некоректний ID активності",
      });
    }

    const activity = await findAccessibleActivity(id, req.user);

    if (!activity) {
      return res.status(404).json({
        status: "error",
        message: "Запис активності не знайдено",
      });
    }

    await prisma.activity.delete({
      where: {
        id,
        ...getAccessFilter(req.user),
      },
    });

    req.app.get("io")
      .to(`user:${activity.userId}`)
      .emit("activity:deleted", { id: activity.id });

    res.status(200).json({
      status: "success",
      message: "Запис активності успішно видалено",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        status: "error",
        message: "Запис активності не знайдено",
      });
    }

    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Помилка під час видалення активності",
    });
  }
};
