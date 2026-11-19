
import jwt from "jsonwebtoken";
import { randomUUID, createHash } from "node:crypto";

export function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "15m",
      jwtid: randomUUID(),
    }
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    {
      userId: user.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
      jwtid: randomUUID(),
    }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
}

export function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}
