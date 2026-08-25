import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // indispensable pour envoyer/recevoir le cookie httpOnly (JWT)
  headers: { "Content-Type": "application/json" },
});

// Intercepteur global : transforme les erreurs backend en messages exploitables directement
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || "Une erreur est survenue. Veuillez réessayer.";
    return Promise.reject({ message, status: error.response?.status });
  }
);

export default api;
