
import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/authController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Реєстрація, вхід та керування токенами
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Реєстрація нового користувача
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *               fullName:
 *                 type: string
 *                 example: Test User
 *     responses:
 *       201:
 *         description: Користувача успішно зареєстровано
 *       400:
 *         description: Некоректні реєстраційні дані
 *       409:
 *         description: Email вже використовується
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вхід користувача
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Успішний вхід, повертає токени
 *       401:
 *         description: Неправильний email або пароль
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Оновлення токенів
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Токени успішно оновлено
 *       401:
 *         description: Недійсний або прострочений токен
 */
router.post("/refresh", refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Вихід користувача
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Вихід успішний
 *       400:
 *         description: Refresh-токен не надано
 */
router.post("/logout", logout);

export default router;
