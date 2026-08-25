import api from "./axios";

export const contactApi = {
  submitMessage: (data) => api.post("/contact", data),
};
