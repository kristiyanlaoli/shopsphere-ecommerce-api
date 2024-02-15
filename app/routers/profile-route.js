import { Router } from "express";
import prisma from "../utils/prisma.js";
import { authToken } from "../middlewares/middlewares.js";

const router = Router();

// Show profile
router.get("/profile", authToken, async (req, res) => {
  res.json(req.user);
});

// Update profile
router.put("/profile", authToken, async (req, res) => {
  const { name, email, image, role_id } = req.body;
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
  res.json({ message: "Profile updated" });
});

export default router;
