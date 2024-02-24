import { Router } from "express";
import prisma from "../utils/prisma.js";
import { authToken } from "../middlewares/middlewares.js";
import { config } from "dotenv";
import bcrypt from "bcrypt";
config();
const bcryptRound = Number(process.env.BCRYPT_ROUND);
const router = Router();

// Show profile
router.get("/profile", authToken, async (req, res) => {
  res.json(req.user);
});

// Update profile
router.put("/profile", authToken, async (req, res) => {
  const { name, email, image, role_id } = req.body;
  //check if name and email is empty
  if (!name || !email) {
    return res.status(400).json({ message: "Name or email is required" });
  }
  //check if email already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      email,
      id: {
        not: req.user.id,
      },
    },
  });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }
  await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      name,
      email,
      image,
      role_id,
    },
  });
  res.json({
    message: "Profile updated",
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    },
  });
});

// Update password
router.put("/profile/password", authToken, async (req, res) => {
  const { old_password, new_password } = req.body;
  // check if password exists
  if (!old_password || !new_password) {
    return res.status(400).json({ message: "Password is required" });
  }
  // check if user valid
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid user" });
  }
  // check if password is valid
  const validPassword = bcrypt.compareSync(old_password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: "Invalid old password" });
  }

  const hashedPassword = bcrypt.hashSync(new_password, bcryptRound);
  await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      password: hashedPassword,
    },
  });
  res.json({ message: "Password updated" });
});

export default router;
