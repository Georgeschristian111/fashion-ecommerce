import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">Erreur 404</p>
      <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
        Page introuvable
      </h1>
      <p className="mt-3 max-w-md text-gray-500">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
