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

export const validateCartRequest = (req, res, next) => {
  const product_id = Number(req.body.product_id);
  const quantity = Number(req.body.quantity);
  const errors = {};

  if (!product_id) {
    errors.product_id = "Must be a valid product_id";
  }

  if (!quantity) {
    errors.quantity = "Must be a valid quantity";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ errors });
  }
  next();
};
