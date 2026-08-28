const STATS = [
  { value: "1K+", label: "Happy Customers" },
  { value: "100+", label: "Premium Products" },
];

export default function About() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-gray-400">
            About Us
          </span>

          <h1 className="mt-2 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
            Timeless Fashion for Every Occasion
          </h1>

          <p className="mt-5 text-gray-500">
            At Fashion., we believe great style should be effortless. Our
            collections are thoughtfully designed with premium fabrics and
            modern trends to help you look and feel your best every day.
          </p>

          <p className="mt-4 text-gray-500">
            Whether you&apos;re shopping for everyday essentials or statement
            pieces, we&apos;re committed to delivering quality, comfort, and
            exceptional customer service.
          </p>

          <div className="mt-8 flex gap-10">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-extrabold text-gray-900">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-100 sm:aspect-[16/10] lg:aspect-[4/5]">
          <img
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&auto=format&fit=crop"
            alt="Sélection de vêtements et accessoires premium"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
