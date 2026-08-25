import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Au chargement de l'app, vérifie si un cookie de session valide existe déjà
  useEffect(() => {
    authApi
      .getMe()
      .then((res) => setUser(res.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(credentials) {
    const res = await authApi.login(credentials);
    setUser(res.user);
    return res.user;
  }

  async function register(data) {
    const res = await authApi.register(data);
    setUser(res.user);
    return res.user;
  }

  async function loginWithGoogle(credential) {
    const res = await authApi.google(credential);
    setUser(res.user);
    return res.user;
  }

  async function logout() {
    await authApi.logout();
    setUser(null);
  }

  const value = { user, isLoading, isAuthenticated: !!user, login, register, loginWithGoogle, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>.");
  return context;
}
