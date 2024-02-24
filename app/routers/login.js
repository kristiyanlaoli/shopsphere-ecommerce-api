import { Router } from "express";
import validateLoginTokenRequest from "../middlewares/login-middlewares.js";
import prisma from "../utils/prisma.js";
import crypto from "crypto";

const router = Router();

router.post("/login", validateLoginTokenRequest, async (req, res) => {
  const user = req.user;
  //Generate Token dan memastikan token tidak ada yg sama:
  let token;
  do {
    token = crypto.randomBytes(64).toString("base64"); //base64
  } while (await prisma.token.findUnique({ where: { token } }));

  await prisma.token.create({
    data: {
      token,
      user_id: user.id,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      is_blocked: user.is_blocked,
      role_id: user.role_id,
      image: user.image,
    },
  });
});

export default router;
