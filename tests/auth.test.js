
import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../src/app.js";

// Реєстрація без обов'язкових полів
test("POST /api/auth/register — відхиляє порожні дані", async () => {
  const response = await request(app)
    .post("/api/auth/register")
    .send({});

  assert.equal(response.status, 400);
  assert.equal(response.body.status, "error");
});

// Реєстрація з некоректним email
test("POST /api/auth/register — відхиляє некоректний email", async () => {
  const response = await request(app)
    .post("/api/auth/register")
    .send({
      email: "invalid-email",
      password: "Password123",
      fullName: "Test User",
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Некоректний формат email");
});

// Вхід без пароля
test("POST /api/auth/login — відхиляє відсутній пароль", async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: "test@example.com",
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.status, "error");
});

// Перевірка захисних HTTP-заголовків
test("Helmet — додає захисні HTTP-заголовки", async () => {
  const response = await request(app).get("/");

  assert.ok(response.headers["x-content-type-options"]);
  assert.ok(response.headers["x-frame-options"]);
});
