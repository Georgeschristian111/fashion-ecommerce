import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { productsApi } from "../api/products";
import ProductCard from "../components/ui/ProductCard";
import ProductGridSkeleton from "../components/ui/ProductGridSkeleton";
import ShopFilters from "../components/ui/ShopFilters";
import Pagination from "../components/ui/Pagination";
import { SORT_OPTIONS } from "../utils/constants";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const category = searchParams.get("category");
  const productType = searchParams.get("productType");
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page")) || 1;

  // Toute modification de filtre/tri met à jour l'URL (?category=MEN&sort=price_asc...)
  // -> filtres partageables par lien et navigables avec le bouton "précédent" du navigateur.
  function updateParams(updates) {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    if (!("page" in updates)) next.delete("page"); // toute nouvelle recherche repart de la page 1
    setSearchParams(next);
    setIsMobileFiltersOpen(false);
  }

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    productsApi
      .getProducts({ category, productType, sort, page, limit: 8 })
      .then((res) => {
        if (!isMounted) return;
        setProducts(res.results);
        setPagination(res.pagination);
      })
      .catch((err) => console.error("Erreur chargement produits :", err))
      .finally(() => isMounted && setIsLoading(false));

    return () => {
      isMounted = false;
    };
  }, [category, productType, sort, page]);

  const activeFiltersCount = [category, productType].filter(Boolean).length;

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar filtres — visible uniquement à partir de lg (ordinateur) */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900">Filters</h2>
          <div className="mt-4">
            <ShopFilters
              category={category}
              productType={productType}
              onCategoryChange={(value) => updateParams({ category: value })}
              onProductTypeChange={(value) => updateParams({ productType: value })}
            />
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Shop</h1>
              <p className="mt-1 text-sm text-gray-500">
                {isLoading ? "Chargement..." : `Showing ${pagination.total} product(s)`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Bouton filtres, visible uniquement en dessous de lg (mobile/tablette) */}
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="btn-secondary relative gap-2 lg:hidden"
              >
                <SlidersHorizontal size={16} />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-xs text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <select
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
                aria-label="Trier par"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Sort By: {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8">
            {isLoading ? (
              <ProductGridSkeleton count={8} />
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 py-20 text-center">
                <p className="text-gray-500">Aucun produit ne correspond à ces filtres.</p>
                <button
                  onClick={() => setSearchParams({})}
                  className="mt-4 text-sm font-semibold text-brand underline"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>

          <Pagination
            page={pagination.page || page}
            totalPages={pagination.totalPages}
            onPageChange={(newPage) => updateParams({ page: newPage })}
          />
        </div>
      </div>

      {/* Tiroir de filtres mobile/tablette */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileFiltersOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-xs overflow-y-auto bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                aria-label="Fermer les filtres"
                className="text-gray-500"
              >
                <X size={22} />
              </button>
            </div>
            <div className="mt-6">
              <ShopFilters
                category={category}
                productType={productType}
                onCategoryChange={(value) => updateParams({ category: value })}
                onProductTypeChange={(value) => updateParams({ productType: value })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
