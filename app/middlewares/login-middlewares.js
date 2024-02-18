import prisma from "../utils/prisma.js";
import bcrypt from "bcrypt";

const validateLoginTokenRequest = async (req, res, next) => {
  const errors = {};
  // Check if email is registered
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    errors.email = "Email is not registered";
  }
  // Validate valid email
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(req.body.email)) {
    errors.email = "Must be a valid email";
  }
  // Validate email
  if (!req.body.email) {
    errors.email = "Email is required";
  }
  // Validate password
  if (!req.body.password) {
    errors.password = "Password is required";
  }
  // Check diblok atau enggak
  if (!user) {
    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ errors });
    }
  }
  if (user.is_blocked) {
    errors.email = "User is blocked";
  }

  //Check Password
  const validPassword = bcrypt.compareSync(req.body.password, user.password);
  if (!validPassword) {
    errors.password = "Invalid password";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ errors });
  }
  req.user = user;
  next();
};

export default validateLoginTokenRequest;
