
import prisma from "../utils/prisma.js";
import bcrypt from "bcryptjs";

// Перевірка формату ID
const isValidId = (id) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};

// Створення користувача
export const createUser = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof fullName !== "string" ||
      !email.trim() ||
      !fullName.trim()
    ) {
      return res.status(400).json({
        status: "error",
        message: "Необхідно вказати email, password та fullName",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: "error",
        message: "Пароль повинен містити щонайменше 8 символів",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        status: "error",
        message: "Некоректний формат email",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        fullName: fullName.trim(),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        status: "error",
        message: "Користувач із таким email вже існує",
      });
    }

    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Помилка під час створення користувача",
    });
  }
};

// Отримання всіх користувачів
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      status: "success",
      results: users.length,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Не вдалося отримати користувачів",
    });
  }
};

// Отримання користувача за ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        status: "error",
        message: "Некоректний ID користувача",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Користувача не знайдено",
      });
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Не вдалося отримати користувача",
    });
  }
};

// Оновлення користувача
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, fullName, password } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({
        status: "error",
        message: "Некоректний ID користувача",
      });
    }

    const data = {};

    if (email !== undefined) {
      if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({
          status: "error",
          message: "Некоректний email",
        });
      }
      data.email = email.trim().toLowerCase();
    }

    if (fullName !== undefined) {
      if (typeof fullName !== "string" || !fullName.trim()) {
        return res.status(400).json({
          status: "error",
          message: "Ім'я не може бути порожнім",
        });
      }
      data.fullName = fullName.trim();
    }

    if (password !== undefined) {
      if (typeof password !== "string" || password.length < 8) {
        return res.status(400).json({
          status: "error",
          message: "Пароль повинен містити щонайменше 8 символів",
        });
      }
      data.passwordHash = await bcrypt.hash(password, 10);
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Не вказано даних для оновлення",
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        status: "error",
        message: "Користувача не знайдено",
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        status: "error",
        message: "Такий email вже використовується",
      });
    }

    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Помилка під час оновлення користувача",
    });
  }
};

// Видалення користувача
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        status: "error",
        message: "Некоректний ID користувача",
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({
      status: "success",
      message: "Користувача успішно видалено",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        status: "error",
        message: "Користувача не знайдено",
      });
    }

    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Помилка під час видалення користувача",
    });
  }
};
