import prisma from "../utils/prisma.js";
const validateSignupTokenRequest = async (req, res, next) => {
  const errors = {};
  // Validate name
  if (req.body.name.length < 1) {
    errors.name = "Name is required";
  }
  // check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (existingUser) {
    errors.email = "Email already in use";
  }
  // Validate valid email
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(req.body.email)) {
    errors.email = "Must be a valid email";
  }
  // Validate email
  if (!req.body.email) {
    errors.email = "Email is required";
  }
  // validate minimum password
  if (req.body.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }
  // Validate password
  if (!req.body.password) {
    errors.password = "Password is required";
  }
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ errors });
  }
  next();
};

export default validateSignupTokenRequest;
