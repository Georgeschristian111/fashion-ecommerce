import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const SHOP_LINKS = [
  { label: "New Arrivals", to: "/shop" },
  { label: "Best Sellers", to: "/shop?featured=true" },
  { label: "Men", to: "/shop?category=MEN" },
  { label: "Women", to: "/shop?category=WOMEN" },
];

const COMPANY_LINKS = [
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "FAQs", to: "/faqs" },
  { label: "Privacy Policy", to: "/privacy" },
];

const SOCIALS = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "X", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="container-page grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-gray-900">
            Fashion.
          </Link>
          <p className="mt-4 max-w-xs text-sm text-gray-500">
            Discover premium fashion designed for comfort, confidence, and everyday style.
            Quality pieces you&apos;ll love season after season.
          </p>
          <div className="mt-5 flex gap-3">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-gray-900 hover:text-white"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-900">Shop</h3>
          <ul className="mt-4 space-y-3">
            {SHOP_LINKS.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="text-sm text-gray-500 hover:text-gray-900">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-900">Company</h3>
          <ul className="mt-4 space-y-3">
            {COMPANY_LINKS.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="text-sm text-gray-500 hover:text-gray-900">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-900">Stay Updated</h3>
          <p className="mt-4 text-sm text-gray-500">
            Subscribe to receive exclusive offers, new arrivals, and fashion inspiration.
          </p>
          <form className="mt-4 flex flex-col gap-2 sm:flex-row lg:flex-col">
            <label htmlFor="newsletter-email" className="sr-only">
              Adresse email
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email"
              className="input-field"
            />
            <button type="submit" className="btn-primary shrink-0">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-sm text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Fashion. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/terms" className="hover:text-gray-900">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-gray-900">
              Privacy
            </Link>
            <Link to="/cookies" className="hover:text-gray-900">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
