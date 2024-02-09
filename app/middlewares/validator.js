const validateTokenRequest = (req, res, next) => {
  const errors = {};

  if (!req.body.email) {
    errors.email = "Email is required";
  }

  // Validate valid email
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(req.body.email)) {
    errors.email = "Must be a valid email";
  }

  if (!req.body.password) {
    errors.password = "Password is required";
  }

  // validate minimum password
  if (req.body.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ errors });
  }
  next();
};

export default validateTokenRequest;
