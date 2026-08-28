export default function LegalPage({ title, updatedAt, children }) {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-gray-400">Last updated: {updatedAt}</p>
        <div className="prose prose-sm mt-8 max-w-none text-gray-600 [&>h2]:mt-8 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-gray-900 [&>p]:mt-3 [&>p]:leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
