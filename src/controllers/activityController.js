
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

// Create activity
export const createActivity = async (req, res) => {
  try {
    const {
      userId,
      type,
      durationMinutes,
      distanceKm,
      caloriesBurned,
      notes,
      startedAt,
    } = req.body;

    if (!isValidId(userId)) {
      return res.status(400).json({
        status: "error",
        message: "Некоректний ID користувача",
      });
    }

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
        userId,
        type,
        durationMinutes,
        distanceKm,
        caloriesBurned,
        notes,
        startedAt: activityDate,
      },
    });

    res.status(201).json({
      status: "success",
      data: activity,
    });
  } catch (error) {
    if (error.code === "P2003") {
      return res.status(404).json({
        status: "error",
        message: "Користувача не знайдено",
      });
    }

    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Помилка під час створення активності",
    });
  }
};

// Get all activities
export const getActivities = async (req, res) => {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: {
        startedAt: "desc",
      },
    });

    res.status(200).json({
      status: "success",
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

// Get activity by ID
export const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        status: "error",
        message: "Некоректний ID активності",
      });
    }

    const activity = await prisma.activity.findUnique({
      where: { id },
    });

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

// Update activity
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
      where: { id },
      data,
    });

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

// Delete activity
export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        status: "error",
        message: "Некоректний ID активності",
      });
    }

    await prisma.activity.delete({
      where: { id },
    });

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
