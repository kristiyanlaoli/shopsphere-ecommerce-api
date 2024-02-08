import prisma from "../utils/prisma.js";
async function validateProductId(req, res, next) {
  const productId = Number(req.params.id);

  if (isNaN(productId)) {
    return res.status(400).json({ message: "id must be a number" });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  req.productId = productId;

  next();
}

export default validateProductId;
