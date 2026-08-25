import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirige vers login en gardant en mémoire la page d'origine, pour y revenir après connexion
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
