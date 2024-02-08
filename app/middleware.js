function validateProductId(req, res, next) {
  const productId = Number(req.params.id);

  if (isNaN(productId)) {
    return res.status(400).json({ message: "id must be a number" });
  }

  req.productId = productId;

  next();
}

export default validateProductId;
