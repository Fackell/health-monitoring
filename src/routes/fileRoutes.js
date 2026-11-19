
import { Router } from "express";

import {
  uploadFile,
  getFiles,
  deleteFile,
} from "../controllers/fileController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Files
 *   description: Завантаження та керування файлами
 */

router.use(authenticateToken);

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Завантаження файлу
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Файл успішно завантажено
 *       400:
 *         description: Некоректний файл або файл не надано
 *       401:
 *         description: Потрібна авторизація
 */
router.post("/upload", upload.single("file"), uploadFile);

/**
 * @swagger
 * /api/files:
 *   get:
 *     summary: Отримання списку файлів
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список файлів користувача
 *       401:
 *         description: Потрібна авторизація
 */
router.get("/", getFiles);

/**
 * @swagger
 * /api/files/{id}:
 *   delete:
 *     summary: Видалення файлу
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Файл успішно видалено
 *       404:
 *         description: Файл не знайдено
 */
router.delete("/:id", deleteFile);

export default router;
