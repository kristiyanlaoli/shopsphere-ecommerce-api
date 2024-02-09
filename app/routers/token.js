import { Router } from "express";
import bcrypt from "bcrypt";
import validateTokenRequest from "../middlewares/validator.js";
import prisma from "../utils/prisma.js";
import crypto from "crypto";

const router = Router();

router.post("/token", validateTokenRequest, async (req, res) => {
  //Check Email
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid email" });
  }

  // Check diblok atau enggak
  if (user.is_blocked) {
    return res.status(401).json({ message: "User is blocked" });
  }

  //Check Password
  const validPassword = bcrypt.compareSync(req.body.password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: "Invalid password" });
  }

  //Generate Token
  // memastikan token tidak ada yg sama:
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
    },
  });
});

export default router;
