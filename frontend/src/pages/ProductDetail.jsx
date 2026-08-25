import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { productsApi } from "../api/products";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/formatPrice";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    productsApi
      .getProductBySlug(slug)
      .then((res) => {
        if (!isMounted) return;
        setProduct(res.product);
        // Présélectionne la première taille/couleur disponibles, comme sur votre maquette
        const firstVariant = res.product.variants?.[0];
        if (firstVariant) {
          setSelectedSize(firstVariant.size);
          setSelectedColor(firstVariant.color);
        }
      })
      .catch(() => isMounted && setError("Produit introuvable."))
      .finally(() => isMounted && setIsLoading(false));

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container-page py-20 text-center text-gray-500">
        Chargement...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-page py-20 text-center text-gray-500">
        {error}
      </div>
    );
  }

  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const colors = [...new Set(product.variants.map((v) => v.color))];

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor,
  );
  const hasVariants = product.variants.length > 0;
  const availableStock = hasVariants
    ? (selectedVariant?.stock ?? 0)
    : product.stock;
  const isOutOfStock = availableStock <= 0;

  async function handleAddToCart() {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/product/${slug}` } } });
      return;
    }
    if (hasVariants && !selectedVariant) {
      setFeedback({
        type: "error",
        message: "Veuillez sélectionner une taille et une couleur.",
      });
      return;
    }

    setIsAdding(true);
    setFeedback(null);
    try {
      await addItem({
        productId: product.id,
        variantId: selectedVariant?.id,
        quantity: 1,
      });
      setFeedback({ type: "success", message: "Article ajouté au panier !" });
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="container-page py-8 sm:py-12">
      {/* Fil d'ariane */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <span>Home</span> <span>›</span> <span>Shop</span> <span>›</span>
        <span className="font-medium text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Galerie */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row lg:flex-row">
          {product.images.length > 1 && (
            <div className="flex gap-3 sm:flex-col">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIndex(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                    i === activeImageIndex
                      ? "border-brand"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
          <div className="aspect-[3/4] w-full flex-1 overflow-hidden rounded-xl bg-gray-100">
            <img
              src={
                product?.images?.[activeImageIndex]?.url ||
                product?.images?.[0]?.url ||
                product?.imageUrl ||
                "https://via.placeholder.com/600x800?text=No+Image"
              }
              alt={product?.name || "Produit"}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Infos produit */}
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-3 text-2xl font-extrabold text-gray-900">
            {formatPrice(product.price)}
          </p>

          <p
            className={`mt-2 text-sm font-medium ${isOutOfStock ? "text-red-600" : "text-green-600"}`}
          >
            {isOutOfStock
              ? "Out of Stock"
              : `In Stock (${availableStock} available)`}
          </p>

          <p className="mt-5 text-sm leading-relaxed text-gray-500">
            {product.description}
          </p>

          {sizes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-900">Select Size</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-11 min-w-[2.75rem] rounded-lg border px-3 text-sm font-semibold ${
                      selectedSize === size
                        ? "border-brand bg-brand text-white"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-900">Select Color</h3>
              <div className="mt-3 flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    aria-label={color}
                    title={color}
                    style={{ backgroundColor: color.toLowerCase() }}
                    className={`h-9 w-9 rounded-full border-2 ${
                      selectedColor === color
                        ? "border-brand ring-2 ring-brand ring-offset-2"
                        : "border-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {(selectedSize || selectedColor) && (
            <div className="mt-6 rounded-xl bg-gray-50 p-4 text-sm">
              <p>
                <span className="font-semibold text-gray-900">
                  Selected Size:
                </span>{" "}
                {selectedSize}
              </p>
              <p className="mt-1">
                <span className="font-semibold text-gray-900">
                  Selected Color:
                </span>{" "}
                {selectedColor}
              </p>
            </div>
          )}

          {feedback && (
            <p
              className={`mt-4 text-sm font-medium ${
                feedback.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {feedback.message}
            </p>
          )}

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className="btn-primary mt-8 w-full gap-2 sm:w-auto sm:px-10"
          >
            <ShoppingBag size={18} />
            {isAdding ? "Ajout..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
