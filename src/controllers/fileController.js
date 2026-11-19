
import prisma from "../utils/prisma.js";
import fs from "node:fs/promises";
import path from "node:path";

// Завантаження файлу
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "Файл не надано",
      });
    }

    const file = await prisma.file.create({
      data: {
        userId: req.user.userId,
        originalName: req.file.originalname,
        storageName: req.file.filename,
        mimeType: req.file.mimetype,
        sizeBytes: req.file.size,
        path: req.file.path,
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Файл успішно завантажено",
      data: file,
    });
  } catch (error) {
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    console.error("File upload error:", error);

    return res.status(500).json({
      status: "error",
      message: "Помилка під час збереження файлу",
    });
  }
};

// Отримання списку файлів користувача
export const getFiles = async (req, res) => {
  try {
    const where = req.user.role === "ADMIN"
      ? {}
      : { userId: req.user.userId };

    const files = await prisma.file.findMany({
      where,
      select: {
        id: true,
        originalName: true,
        mimeType: true,
        sizeBytes: true,
        uploadedAt: true,
      },
      orderBy: {
        uploadedAt: "desc",
      },
    });

    return res.status(200).json({
      status: "success",
      results: files.length,
      data: files,
    });
  } catch (error) {
    console.error("Get files error:", error);

    return res.status(500).json({
      status: "error",
      message: "Не вдалося отримати файли",
    });
  }
};

// Видалення файлу
export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const where = req.user.role === "ADMIN"
      ? { id }
      : { id, userId: req.user.userId };

    const file = await prisma.file.findFirst({ where });

    if (!file) {
      return res.status(404).json({
        status: "error",
        message: "Файл не знайдено",
      });
    }

    await fs.unlink(file.path).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });

    await prisma.file.delete({
      where: { id: file.id },
    });

    return res.status(200).json({
      status: "success",
      message: "Файл успішно видалено",
    });
  } catch (error) {
    console.error("Delete file error:", error);

    return res.status(500).json({
      status: "error",
      message: "Помилка під час видалення файлу",
    });
  }
};
