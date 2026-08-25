import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-extrabold text-gray-900">Reset Password</h1>
      <p className="mt-3 max-w-sm text-sm text-gray-500">
        Cette fonctionnalité sera bientôt disponible. En attendant, contactez notre support.
      </p>
      <Link to="/login" className="btn-secondary mt-6">
        Retour à la connexion
      </Link>
    </div>
  );
}
