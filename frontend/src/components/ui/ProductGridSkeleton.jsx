export default function ProductGridSkeleton({ count = 5 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-xl border border-gray-100">
          <div className="aspect-[3/4] w-full bg-gray-200" />
          <div className="space-y-2 p-3 sm:p-4">
            <div className="h-4 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-1/3 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
