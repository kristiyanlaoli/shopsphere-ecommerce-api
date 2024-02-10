import bcrypt from "bcrypt";
import { Router } from "express";
import prisma from "../utils/prisma.js";
import { config } from "dotenv";
import validateTokenRequest from "../middlewares/validator.js";
config();
const router = Router();
const bcryptRound = Number(process.env.BCRYPT_ROUND);

router.post("/signup", validateTokenRequest, async (req, res) => {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const role = await prisma.role.findUnique({
    where: {
      name: req.body.role.toUpperCase(),
    },
  });

  if (!role) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, bcryptRound);

  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      role_id: role.id,
    },
  });

  res.status(201).json({
    message: "User has been created",
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: role.name,
    },
  });
});

export default router;
