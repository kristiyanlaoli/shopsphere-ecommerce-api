import prisma from "../utils/prisma.js";
const validateCartRequest = async (req, res, next) => {
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

export default validateCartRequest;
