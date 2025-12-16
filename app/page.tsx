import Link from "next/link";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import FeaturedCarousel from "@/components/FeaturedCarousel";

async function getFeaturedProducts() {
  try {
    await connectDB();
    // Fetch 6 new arrivals
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(6).lean();

    // Serialize for valid props (convert _id to string)
    return products.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      images: (p.images || []).map((img: any) => ({
        color: img.color,
        image: img.image,
      })),
      imageUrl: p.imageUrl || null
    }));
  } catch (e) {
    console.error("Failed to connect/fetch", e);
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center min-h-[600px] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 opacity-40"
          style={{
            backgroundImage: "url('/hero-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
            Minimalist.<br className="md:hidden" /> timeless.<br className="md:hidden" /> <span className="text-emerald-400">Essential.</span>
          </h1>
          <p className="max-w-xl text-lg text-gray-200 mb-10 drop-shadow-md font-medium">
            Curated collection of premium products for your lifestyle.
            Designed for simplicity and functionality.
          </p>
          <div className="flex space-x-4">
            <Link href="/products" className="bg-emerald-600 text-white px-8 py-3 rounded-full font-medium hover:bg-emerald-700 transition-colors shadow-lg backdrop-blur-sm bg-opacity-90">
              Shop Now
            </Link>
            <Link href="/about" className="bg-white/10 border border-white/30 text-white px-8 py-3 rounded-full font-medium hover:bg-white/20 transition-colors backdrop-blur-md">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Collection</h2>
          <Link href="/products" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">View All &rarr;</Link>
        </div>

        {/* Products Grid / Carousel */}
        <FeaturedCarousel products={featuredProducts} />
      </section>
    </div>
  );
}
