export const Role = {
  ADMINISTRATOR: "administrator",
  SELLER: "seller",
  REGULAR_USER: "regular_user",
};

export const Permission = {
  BROWSE_CATEGORIES: "browse_categories",
  READ_CATEGORY: "read_category",
  EDIT_CATEGORY: "edit_category",
  ADD_CATEGORY: "add_category",
  DELETE_CATEGORY: "delete_category",

  BROWSE_PRODUCTS: "browse_products",
  READ_PRODUCT: "read_product",
  EDIT_PRODUCT: "edit_product",
  ADD_PRODUCT: "add_product",
  DELETE_PRODUCT: "delete_product",

  BROWSE_CARTS: "browse_carts",
  READ_CART: "read_cart",
  EDIT_CART: "edit_cart",
  ADD_CART: "add_cart",
  DELETE_CART: "delete_cart",

  ADD_ORDER: "add_order",

  ADD_PAYMENT: "add_payment",
};

// Permission.BROWSE_PRODUCTS
export const PermissionAssignment = {
  [Role.ADMINISTRATOR]: [
    Permission.BROWSE_PRODUCTS,
    Permission.READ_PRODUCT,
    Permission.EDIT_PRODUCT,
    Permission.ADD_PRODUCT,
    Permission.DELETE_PRODUCT,

    Permission.BROWSE_CARTS,
    Permission.ADD_CART,
    Permission.DELETE_CART,

    Permission.BROWSE_CATEGORIES,
    Permission.READ_CATEGORY,
    Permission.EDIT_CATEGORY,
    Permission.ADD_CATEGORY,
    Permission.DELETE_CATEGORY,

    Permission.ADD_ORDER,

    Permission.ADD_PAYMENT,
  ],
  [Role.SELLER]: [
    Permission.BROWSE_PRODUCTS,
    Permission.READ_PRODUCT,
    Permission.EDIT_PRODUCT,
    Permission.ADD_PRODUCT,
    Permission.DELETE_PRODUCT,

    Permission.BROWSE_CARTS,
    Permission.ADD_CART,
    Permission.DELETE_CART,

    Permission.BROWSE_CATEGORIES,
    Permission.READ_CATEGORY,

    Permission.ADD_ORDER,

    Permission.ADD_PAYMENT,
  ],

  [Role.REGULAR_USER]: [
    Permission.BROWSE_PRODUCTS,
    Permission.READ_PRODUCT,

    Permission.BROWSE_CARTS,
    Permission.ADD_CART,
    Permission.DELETE_CART,

    Permission.BROWSE_CATEGORIES,
    Permission.READ_CATEGORY,

    Permission.ADD_ORDER,

    Permission.ADD_PAYMENT,
  ],
};
