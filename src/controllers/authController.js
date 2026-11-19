
import prisma from "../utils/prisma.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
} from "../utils/jwt.js";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function createTokenPair(user, db = prisma) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const decoded = verifyRefreshToken(refreshToken);

  await db.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(decoded.exp * 1000),
    },
  });

  return { accessToken, refreshToken };
}

// Реєстрація
export async function register(req, res) {
  try {
    const { email, password, fullName } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof fullName !== "string" ||
      !email.trim() ||
      !password ||
      !fullName.trim()
    ) {
      return res.status(400).json({
        status: "error",
        message: "Заповніть усі обов'язкові поля",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        status: "error",
        message: "Некоректний формат email",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: "error",
        message: "Пароль повинен містити щонайменше 8 символів",
      });
    }

    if (fullName.trim().length > 100) {
      return res.status(400).json({
        status: "error",
        message: "Ім'я не повинно перевищувати 100 символів",
      });
    }

    const passwordHash = await hashPassword(password);

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

    const tokens = await createTokenPair(user);

    return res.status(201).json({
      status: "success",
      message: "Реєстрація успішна",
      user,
      ...tokens,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        status: "error",
        message: "Користувач із таким email вже існує",
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      status: "error",
      message: "Помилка під час реєстрації",
    });
  }
}

// Вхід
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        status: "error",
        message: "Введіть email та пароль",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    if (!user || !(await verifyPassword(user.passwordHash, password))) {
      return res.status(401).json({
        status: "error",
        message: "Неправильний email або пароль",
      });
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };

    const tokens = await createTokenPair(safeUser);

    return res.status(200).json({
      status: "success",
      message: "Вхід успішний",
      user: safeUser,
      ...tokens,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      status: "error",
      message: "Помилка під час входу",
    });
  }
}

// Оновлення токенів
export async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;

    if (typeof refreshToken !== "string" || !refreshToken) {
      return res.status(400).json({
        status: "error",
        message: "Refresh-токен не надано",
      });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const tokenHash = hashToken(refreshToken);

    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (!storedToken) {
      await prisma.refreshToken.updateMany({
        where: { userId: decoded.userId },
        data: { revokedAt: new Date() },
      });

      return res.status(401).json({
        status: "error",
        message: "Токен недійсний або вже використаний",
      });
    }

    if (
      storedToken.revokedAt ||
      storedToken.expiresAt <= new Date()
    ) {
      await prisma.refreshToken.updateMany({
        where: { userId: decoded.userId },
        data: { revokedAt: new Date() },
      });

      return res.status(401).json({
        status: "error",
        message: "Токен прострочений або відкликаний",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Користувача не знайдено",
      });
    }

    const tokens = await prisma.$transaction(async (tx) => {
      const revoked = await tx.refreshToken.updateMany({
        where: {
          id: storedToken.id,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      if (revoked.count !== 1) {
        throw new Error("REFRESH_TOKEN_ALREADY_USED");
      }

      return createTokenPair(user, tx);
    });

    return res.status(200).json({
      status: "success",
      message: "Токени успішно оновлено",
      user,
      ...tokens,
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "Недійсний або прострочений refresh-токен",
      });
    }

    if (error.message === "REFRESH_TOKEN_ALREADY_USED") {
      return res.status(401).json({
        status: "error",
        message: "Refresh-токен уже використаний",
      });
    }

    console.error("Refresh error:", error);

    return res.status(500).json({
      status: "error",
      message: "Помилка під час оновлення токенів",
    });
  }
}

// Вихід
export async function logout(req, res) {
  try {
    const { refreshToken } = req.body;

    if (typeof refreshToken !== "string" || !refreshToken) {
      return res.status(400).json({
        status: "error",
        message: "Refresh-токен не надано",
      });
    }

    await prisma.refreshToken.updateMany({
      where: {
        tokenHash: hashToken(refreshToken),
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Вихід успішний",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      status: "error",
      message: "Помилка під час виходу",
    });
  }
}
