
import "dotenv/config";
import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { io as createClient } from "socket.io-client";

import app from "../src/app.js";
import { initSocket } from "../src/socket/index.js";
import { generateAccessToken } from "../src/utils/jwt.js";

test("Socket.io — перевіряє JWT-авторизацію підключення", async () => {
  const httpServer = createServer(app);
  const ioServer = initSocket(httpServer);

  await new Promise((resolve) => {
    httpServer.listen(0, resolve);
  });

  const port = httpServer.address().port;
  const url = `http://localhost:${port}`;

  let unauthorizedClient;
  let authorizedClient;

  try {
    unauthorizedClient = createClient(url, {
      reconnection: false,
      transports: ["websocket"],
    });

    const connectionError = await new Promise((resolve, reject) => {
      unauthorizedClient.once("connect_error", resolve);
      unauthorizedClient.once("connect", () => {
        reject(new Error("Підключення без токена не повинно проходити"));
      });
    });

    assert.match(connectionError.message, /авторизац/i);

    const token = generateAccessToken({
      id: "60eda745-574c-4df4-8e8e-0f0763a71248",
      role: "USER",
    });

    authorizedClient = createClient(url, {
      auth: { token },
      reconnection: false,
      transports: ["websocket"],
    });

    await new Promise((resolve, reject) => {
      authorizedClient.once("connect", resolve);
      authorizedClient.once("connect_error", reject);
    });

    assert.ok(authorizedClient.connected);

    const receivedEvent = new Promise((resolve) => {
        authorizedClient.once("activity:created", resolve);
    });

    ioServer
        .to("user:60eda745-574c-4df4-8e8e-0f0763a71248")
        .emit("activity:created", {
            id: "test-activity",
            type: "WALKING",
  });

const eventData = await receivedEvent;

assert.equal(eventData.id, "test-activity");
assert.equal(eventData.type, "WALKING");

  } finally {
    unauthorizedClient?.close();
    authorizedClient?.close();

    await new Promise((resolve) => {
      ioServer.close(resolve);
    });
  }
});
