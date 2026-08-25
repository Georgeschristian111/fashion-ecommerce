import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { summary } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <nav className="container-page flex h-16 items-center justify-between md:h-20">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-gray-900">
          Fashion.
        </Link>

        {/* Liens desktop (cachés en dessous de lg, comme votre maquette tablette/mobile) */}
        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `text-sm font-medium uppercase tracking-wide transition ${
                    isActive
                      ? "border-b-2 border-gray-900 pb-1 text-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Icônes d'action */}
        <div className="flex items-center gap-4 sm:gap-5">
          <button
            aria-label="Rechercher"
            className="hidden text-gray-700 hover:text-gray-900 sm:block"
          >
            <Search size={22} />
          </button>

          <Link
            to={isAuthenticated ? "/account" : "/login"}
            aria-label="Compte"
            className="text-gray-700 hover:text-gray-900"
          >
            <User size={22} />
          </Link>

          <Link to="/cart" aria-label="Panier" className="relative text-gray-700 hover:text-gray-900">
            <ShoppingBag size={22} />
            {summary.itemsCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {summary.itemsCount}
              </span>
            )}
          </Link>

          {/* Bouton hamburger, visible uniquement en dessous de lg (tablette/mobile) */}
          <button
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            className="text-gray-700 hover:text-gray-900 lg:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Menu mobile/tablette déroulant */}
      {isMenuOpen && (
        <ul className="border-t border-gray-100 bg-white px-4 py-4 lg:hidden">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-3 text-sm font-medium uppercase tracking-wide ${
                    isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
