import { useState } from "react";
import { Trash2 } from "lucide-react";
import { formatPrice } from "../../utils/formatPrice";

export default function CartItemRow({ item, onUpdateQuantity, onRemove }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const image = item.product.images?.[0];

  async function changeQuantity(delta) {
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;
    setIsUpdating(true);
    try {
      await onUpdateQuantity(item.id, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:p-5">
      <div className="h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-24 sm:w-20">
        {image && <img src={image.url} alt={item.product.name} className="h-full w-full object-cover" />}
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-gray-900">{item.product.name}</h3>
        {item.variant && (
          <div className="mt-1 flex gap-2">
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
              Size: {item.variant.size}
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
              Color: {item.variant.color}
            </span>
          </div>
        )}
        <p className="mt-2 text-lg font-extrabold text-gray-900">{formatPrice(item.product.price)}</p>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
        <div className="flex items-center rounded-lg border border-gray-300">
          <button
            onClick={() => changeQuantity(-1)}
            disabled={isUpdating}
            aria-label="Diminuer la quantité"
            className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
          <button
            onClick={() => changeQuantity(1)}
            disabled={isUpdating}
            aria-label="Augmenter la quantité"
            className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
          >
            +
          </button>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700"
        >
          <Trash2 size={16} />
          Remove
        </button>
      </div>
    </div>
  );
}
