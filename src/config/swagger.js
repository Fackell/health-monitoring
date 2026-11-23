
import swaggerJsdoc from "swagger-jsdoc";

const isProduction = process.env.NODE_ENV === "production";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Health Monitoring API",
      version: "1.0.0",
      description: "API системи моніторингу фізичної активності та здоров'я",
    },
    servers: [
      {
        url: isProduction
          ? "https://health-monitoring-grk9.onrender.com"
          : "http://localhost:3000",
        description: isProduction ? "Production server" : "Локальний сервер",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
