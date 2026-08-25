import { CATEGORIES, PRODUCT_TYPES } from "../../utils/constants";

// Le backend n'accepte qu'une seule catégorie/type à la fois (voir GET /api/products),
// donc les cases à cocher se comportent comme un choix unique par groupe : cocher une
// nouvelle valeur désélectionne automatiquement l'ancienne.
export default function ShopFilters({ category, productType, onCategoryChange, onProductTypeChange }) {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">Categories</h3>
        <ul className="mt-4 space-y-3">
          {CATEGORIES.map((cat) => (
            <li key={cat.value}>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={category === cat.value}
                  onChange={() => onCategoryChange(category === cat.value ? null : cat.value)}
                  className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                />
                {cat.label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">Product Type</h3>
        <ul className="mt-4 space-y-3">
          {PRODUCT_TYPES.map((type) => (
            <li key={type.value}>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={productType === type.value}
                  onChange={() => onProductTypeChange(productType === type.value ? null : type.value)}
                  className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                />
                {type.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
