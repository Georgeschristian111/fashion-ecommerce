import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";

export default function ProductCard({ product }) {
  const image = product.images?.[0];

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-xl border border-gray-100 bg-white transition hover:shadow-md"
    >
      <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            Pas d&apos;image
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="truncate text-sm font-bold text-gray-900 sm:text-base">{product.name}</h3>
        <p className="mt-1 text-sm font-bold text-gray-900 sm:text-base">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
