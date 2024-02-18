import bcrypt from "bcrypt";
import { Router } from "express";
import prisma from "../utils/prisma.js";
import { config } from "dotenv";
import validateSignupTokenRequest from "../middlewares/signup-middlewares.js";
config();
const router = Router();
const bcryptRound = Number(process.env.BCRYPT_ROUND);

router.post("/signup", validateSignupTokenRequest, async (req, res) => {
  const role = await prisma.role.findUnique({
    where: {
      name: "REGULAR_USER",
    },
  });

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
