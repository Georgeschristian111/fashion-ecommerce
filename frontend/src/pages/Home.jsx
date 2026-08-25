import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, RotateCcw, Headphones } from "lucide-react";
import { productsApi } from "../api/products";
import ProductCard from "../components/ui/ProductCard";
import ProductGridSkeleton from "../components/ui/ProductGridSkeleton";

const WHY_SHOP_ITEMS = [
  {
    icon: RefreshCw,
    title: "Easy Exchange",
    description: "Exchange your items quickly and hassle-free.",
  },
  {
    icon: RotateCcw,
    title: "7-Day Returns",
    description: "Not satisfied? Return your order within 7 days.",
  },
  {
    icon: Headphones,
    title: "Best Support",
    description: "Our support team is available whenever you need help.",
  },
];

export default function Home() {
  const [latestProducts, setLatestProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHomeData() {
      try {
        const [latestRes, featuredRes] = await Promise.all([
          productsApi.getProducts({ sort: "newest", limit: 10 }),
          productsApi.getProducts({ featured: "true", limit: 10 }),
        ]);
        if (!isMounted) return;
        setLatestProducts(latestRes.results);
        setBestSellers(featuredRes.results);
      } catch (err) {
        console.error("Erreur lors du chargement des produits :", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadHomeData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      {/* ===== Hero ===== */}
      <section className="container-page py-10 sm:py-14 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 text-xs font-medium text-gray-700 sm:text-sm">
              ✨ New Collection 2026
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Elevate Your Style With Premium Fashion
            </h1>

            <p className="mt-5 max-w-md text-base text-gray-500 sm:text-lg">
              Discover timeless essentials and the latest trends for men and women.
              Crafted with premium materials to keep you looking your best every season.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/shop" className="btn-primary">
                Shop Now
              </Link>
              <Link to="/about" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-100 sm:aspect-[16/10] lg:aspect-[4/5]">
              <img
                 src="https://images.unsplash.com/photo-1544441893-675973e31985?w=900&auto=format&fit=crop"
                alt="Modèle portant une veste noire premium"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 left-4 rounded-xl bg-white px-5 py-4 shadow-lg sm:bottom-6 sm:left-6">
              <p className="text-xs text-gray-500 sm:text-sm">Starting From</p>
              <p className="text-xl font-extrabold text-gray-900 sm:text-2xl">$9.99</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Latest Collections ===== */}
      <section className="container-page py-10 sm:py-14">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Latest Collections</h2>
          <p className="mt-3 text-gray-500">New Arrivals added weekly.</p>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <ProductGridSkeleton count={10} />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== Best Sellers ===== */}
      <section className="bg-gray-50 py-10 sm:py-14">
        <div className="container-page">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Best Sellers</h2>
            <p className="mt-3 text-gray-500">
              Discover our most-loved pieces, carefully selected by thousands of happy customers.
              Timeless styles designed to elevate your wardrobe.
            </p>
          </div>

          <div className="mt-10">
            {isLoading ? (
              <ProductGridSkeleton count={10} />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {bestSellers.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== Why Shop With Us ===== */}
      <section className="container-page py-10 sm:py-14">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Why Shop With Us</h2>
          <p className="mt-3 text-gray-500">
            We&apos;re committed to providing a seamless shopping experience with premium
            products and exceptional customer service.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {WHY_SHOP_ITEMS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Icon size={26} className="text-gray-900" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
