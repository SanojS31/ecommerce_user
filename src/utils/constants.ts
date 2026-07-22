export const userApiRoutes = Object.freeze({
  auth: {
    register: "/api/user/auth/register",
    login: "/api/user/auth/login",
    logout: "/api/user/auth/logout",
    refreshToken: "/api/user/auth/refresh-token",
  },
  product: {
    getAll: "/api/user/product",
    getById: (id: string) => `/api/user/product/${id}`,
    featured: "/api/user/product/featured",
  },
  cart: {
    base: "/api/user/cart",
    add: "/api/user/cart/add",
    remove: (variantId: string) => `/api/user/cart/remove/${variantId}`,
    update: "/api/user/cart/update",
    clear: "/api/user/cart/clear",
  },
  wishlist: {
    base: "/api/user/wishlist",
    add: "/api/user/wishlist/add",
    remove: (productId: string) => `/api/user/wishlist/remove/${productId}`,
    clear: "/api/user/wishlist/clear",
  },
  order: {
    create: "/api/user/order/create",
    getAll: "/api/user/order",
    getById: (id: string) => `/api/user/order/${id}`,
    cancel: (id: string) => `/api/user/order/cancel/${id}`,
    submitPaymentProof: (id: string) => `/api/user/order/payment-proof/${id}`,
    paymentDetails: "/api/user/order/payment-details",
  },
  profile: {
    get: "/api/user/profile",
    update: "/api/user/profile/update",
    addAddress: "/api/user/profile/address/add",
    updateAddress: (id: string) => `/api/user/profile/address/update/${id}`,
    removeAddress: (id: string) => `/api/user/profile/address/remove/${id}`,
    setDefault: (id: string) =>
      `/api/user/profile/address/set-default/${id}`,
  },
  review: {
    getReviews: (productId: string) => `/api/user/product/${productId}/reviews`,
    submitReview: (productId: string) => `/api/user/product/${productId}/reviews`,
  },
});