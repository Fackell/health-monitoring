
import { Router } from "express";

import {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
} from "../controllers/activityController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Activities
 *   description: Керування фізичною активністю
 */

// Усі маршрути потребують авторизації
router.use(authenticateToken);

/**
 * @swagger
 * /api/activities:
 *   post:
 *     summary: Створення запису активності
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - durationMinutes
 *               - startedAt
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [WALKING, RUNNING, CYCLING, SWIMMING, STRENGTH_TRAINING, OTHER]
 *               durationMinutes:
 *                 type: integer
 *                 example: 30
 *               distanceKm:
 *                 type: number
 *                 example: 2.5
 *               caloriesBurned:
 *                 type: integer
 *                 example: 120
 *               notes:
 *                 type: string
 *                 example: Evening walk
 *               startedAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Активність створено
 *       400:
 *         description: Некоректні дані
 *       401:
 *         description: Потрібна авторизація
 */
router.post("/", createActivity);

/**
 * @swagger
 * /api/activities:
 *   get:
 *     summary: Отримання списку активностей
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [WALKING, RUNNING, CYCLING, SWIMMING, STRENGTH_TRAINING, OTHER]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Пошук за нотатками
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Список активностей із пагінацією
 *       401:
 *         description: Потрібна авторизація
 */
router.get("/", getActivities);

/**
 * @swagger
 * /api/activities/{id}:
 *   get:
 *     summary: Отримання активності за ID
 *     tags: [Activities]
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
 *         description: Дані активності
 *       404:
 *         description: Запис не знайдено
 */
router.get("/:id", getActivityById);

/**
 * @swagger
 * /api/activities/{id}:
 *   put:
 *     summary: Оновлення активності
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [WALKING, RUNNING, CYCLING, SWIMMING, STRENGTH_TRAINING, OTHER]
 *               durationMinutes:
 *                 type: integer
 *               distanceKm:
 *                 type: number
 *                 nullable: true
 *               caloriesBurned:
 *                 type: integer
 *                 nullable: true
 *               notes:
 *                 type: string
 *                 nullable: true
 *               startedAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Активність оновлено
 *       404:
 *         description: Запис не знайдено
 */
router.put("/:id", updateActivity);

/**
 * @swagger
 * /api/activities/{id}:
 *   delete:
 *     summary: Видалення активності
 *     tags: [Activities]
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
 *         description: Активність видалено
 *       404:
 *         description: Запис не знайдено
 */
router.delete("/:id", deleteActivity);

export default router;
