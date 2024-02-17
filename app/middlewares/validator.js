import prisma from "../utils/prisma.js";
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

export const validateCartRequest = async (req, res, next) => {
  const product_id = Number(req.body.product_id);
  const quantity = Number(req.body.quantity);

  if (!product_id || !quantity) {
    return res
      .status(400)
      .json({ message: "Must be a valid product_id and quantity" });
  }
  // check if product exists
  const checkProduct = await prisma.product.findFirst({
    where: { id: product_id },
  });

  if (!checkProduct) {
    return res.status(404).json({ message: "Product not found" });
  }
  req.product_id = product_id;
  req.quantity = quantity;
  req.product = checkProduct;
  next();
};
