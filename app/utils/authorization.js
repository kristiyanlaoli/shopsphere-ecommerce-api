export const Role = {
  SELLER: "seller",
  REGULAR_USER: "regular_user",
};

export const Permission = {
  BROWSE_PRODUCTS: "browse_products",
  READ_PRODUCT: "read_product",
  EDIT_PRODUCT: "edit_product",
  ADD_PRODUCT: "add_product",
  DELETE_PRODUCT: "delete_product",

  BROWSE_CARTS: "browse_carts",
  READ_CART: "read_cart", // not used
  EDIT_CART: "edit_cart", // not used
  ADD_CART: "add_cart",
  DELETE_CART: "delete_cart",

  ADD_ORDER: "add_order",

  ADD_PAYMENT: "add_payment",

  ADD_ROLESELLER: "add_roleseller",
};

// Permission.BROWSE_PRODUCTS
export const PermissionAssignment = {
  [Role.SELLER]: [
    Permission.BROWSE_PRODUCTS,
    Permission.READ_PRODUCT,
    Permission.EDIT_PRODUCT,
    Permission.ADD_PRODUCT,
    Permission.DELETE_PRODUCT,

    Permission.BROWSE_CARTS,
    Permission.READ_CART,
    Permission.EDIT_CART,
    Permission.ADD_CART,
    Permission.DELETE_CART,

    Permission.ADD_ORDER,

    Permission.ADD_PAYMENT,
  ],

  [Role.REGULAR_USER]: [
    Permission.ADD_ROLESELLER,

    Permission.BROWSE_PRODUCTS,
    Permission.READ_PRODUCT,

    Permission.BROWSE_CARTS,
    Permission.READ_CART,
    Permission.EDIT_CART,
    Permission.ADD_CART,
    Permission.DELETE_CART,

    Permission.ADD_ORDER,

    Permission.ADD_PAYMENT,
  ],
};
