
import { Router } from "express";

import {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
} from "../controllers/activityController.js";

const router = Router();

router.route("/")
  .post(createActivity)
  .get(getActivities);

router.route("/:id")
  .get(getActivityById)
  .put(updateActivity)
  .delete(deleteActivity);

export default router;
