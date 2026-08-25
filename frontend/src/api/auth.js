import api from "./axios";

export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  google: (credential) => api.post("/auth/google", { credential }),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
};
