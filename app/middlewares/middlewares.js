import prisma from "../utils/prisma.js";

export const authToken = async (req, res, next) => {
  // check if token exist on request header
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }

  //check if token exist in database
  const validToken = await prisma.token.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          is_blocked: true,
          role_id: true,
          image: true,
        },
      },
    },
  });

  if (!validToken) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // check if token has not expired
  if (validToken.expires_at < new Date()) {
    return res.status(401).json({ message: "Token is expired" });
  }

  // check if user is not blocked
  if (validToken.user.is_blocked) {
    return res.status(401).json({ message: "Blocked user" });
  }

  // Append user to request
  req.user = validToken.user;

  next();
};

export const authorizePermission = (permission) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const permissionRecords = await prisma.permissionRole.findMany({
      where: { role_id: req.user.role_id },
      include: { permission: true },
    });

    const permissions = permissionRecords.map(
      (record) => record.permission.name
    );

    // console.log("permissionsRecords", permissionRecords);
    // console.log("req.user.role_id ", req.user.role_id);
    // console.log("looking for permission", permission);
    // console.log("in permissions", permissions);

    if (!permissions.includes(permission)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
};

export async function validateProductId(req, res, next) {
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

export const checkSeller = async (req, res, next) => {
  const { productId } = req;
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (product.seller_id !== req.user.id) {
    return res.status(401).json({ message: "You are not authorized" });
  }
  next();
};
