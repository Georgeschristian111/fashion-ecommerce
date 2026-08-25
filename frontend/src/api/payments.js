import api from "./axios";

export const paymentsApi = {
  createCheckoutSession: (orderId) => api.post(`/payments/create-checkout-session/${orderId}`),
  verifyPayment: (orderId) => api.get(`/payments/verify/${orderId}`),
};
