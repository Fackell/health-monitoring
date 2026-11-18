
import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/health", healthRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to Health Monitoring API",
    version: "1.0.0",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Health Monitoring API is running",
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Маршрут не знайдено",
  });
});

export default app;
