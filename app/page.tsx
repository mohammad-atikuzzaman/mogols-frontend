import Link from "next/link";
import ProductCard from "../components/ProductCard";
import { ArrowRight, Leaf, ShieldCheck, Truck, Star, Heart, Clock, Award } from "lucide-react";
import productService from "../services/productService";

export default async function Home() {
  let products: any[] = [];
  try {
    products = await productService.getProducts();
  } catch (error) {
    console.error("Failed to fetch products during build:", error);
  }

  // Ensure we have an array
  products = Array.isArray(products) ? products : [];

  const featuredProducts = products.slice(0, 8); // Show top 8 for a fuller grid

  // Categories placeholder data
  const categories = [
    { name: "Organic Honey", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800", link: "/shop?category=honey" },
    { name: "Premium Oils", image: "https://images.unsplash.com/photo-1474979266404-7cadd259d366?auto=format&fit=crop&q=80&w=800", link: "/shop?category=oils" },
    { name: "Nuts & Seeds", image: "https://images.unsplash.com/photo-1596910547037-846b1980329f?auto=format&fit=crop&q=80&w=800", link: "/shop?category=seeds" },
    { name: "Fresh Ghee", image: "https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&q=80&w=800", link: "/shop?category=ghee" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-zinc-900 dark:to-zinc-950 opacity-90" />
          {/* Abstract Circle/Shape */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full bg-green-200/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] rounded-full bg-emerald-200/20 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Hero Text */}
            <div className="space-y-8 animate-in fade-in slide-in-from-left-10 duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-800 border border-green-100 dark:border-zinc-700 shadow-sm">
                <Leaf className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">100% Organic Certified</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
                Pure Nature, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  Delivered Fresh.
                </span>
              </h1>

              <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-lg leading-relaxed">
                Experience the authentic taste of premium organic products. Sourced directly from trusted farmers to your table.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Shop Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-green-700 bg-white border-2 border-green-100 rounded-full hover:border-green-200 hover:bg-green-50 transition-all duration-300 dark:bg-transparent dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  Our Story
                </Link>
              </div>

              {/* Stats/Trust */}
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-white">10k+</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Happy Customers</p>
                </div>
                <div className="w-px h-12 bg-zinc-200 dark:bg-zinc-800" />
                <div>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-white">100%</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Pure Organic</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-[500px] lg:h-[700px] hidden lg:block animate-in fade-in zoom-in-50 duration-1000 delay-200">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-50 dark:from-zinc-800 dark:to-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl rotate-3">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000"
                  alt="Organic Products"
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute bottom-10 -left-10 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 animate-bounce cursor-default">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-white">5.0 Star Rating</p>
                    <p className="text-xs text-zinc-500">Based on 200+ Reviews</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- TRUST FEATURES --- */}
      <section className="py-16 bg-white dark:bg-zinc-950 border-y border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Leaf, title: "100% Organic", desc: "Certified Natural" },
              { icon: Clock, title: "Fresh Everyday", desc: "Farm to Table" },
              { icon: ShieldCheck, title: "Secure Payment", desc: "100% Safe" },
              { icon: Award, title: "Top Quality", desc: "Premium Grade" },
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-4 hover:transform hover:scale-105 transition-all">
                <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-full mb-4 text-green-600 dark:text-green-400">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">{feature.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CATEGORIES --- */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-green-600 font-semibold tracking-wider uppercase text-sm">Collections</span>
            <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mt-2 mb-4">Shop by Category</h2>
            <p className="text-zinc-600 dark:text-zinc-400">Explore our wide range of organic products curated just for your health.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link href={cat.link} key={idx} className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
                  <h3 className="text-2xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{cat.name}</h3>
                  <span className="mt-2 text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full">
                    View Items
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED PRODUCTS --- */}
      <section className="py-24 bg-zinc-100/50 dark:bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-green-600 font-semibold tracking-wider uppercase text-sm">Best Sellers</span>
              <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mt-2">New Arrivals</h2>
            </div>
            <Link href="/shop" className="group flex items-center text-zinc-800 dark:text-zinc-200 font-medium hover:text-green-600 transition-colors">
              View All Products
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-zinc-500">
                <p>No products available right now. Please check back later.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-24 bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Loved by our Customers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah J.", role: "Health Enthusiast", comment: "The honey is absolutely divine. You can taste the purity in every spoonful. Highly recommended!", img: "https://randomuser.me/api/portraits/women/44.jpg" },
              { name: "Michael R.", role: "Chef", comment: "I use Mogols organic oils in my restaurant. The quality is unmatched and my customers love it.", img: "https://randomuser.me/api/portraits/men/32.jpg" },
              { name: "Emily W.", role: "Mother", comment: "Finally a trustworthy source for organic fruits for my kids. Fast delivery and always fresh.", img: "https://randomuser.me/api/portraits/women/68.jpg" }
            ].map((t, i) => (
              <div key={i} className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl relative">
                <div className="absolute top-8 right-8 text-green-200 dark:text-green-900/20">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                  </svg>
                </div>
                <div className="flex gap-4 items-center mb-6">
                  <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white">{t.name}</h4>
                    <p className="text-xs text-zinc-500">{t.role}</p>
                  </div>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 italic">"{t.comment}"</p>
                <div className="flex gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-yellow-500 fill-yellow-500" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PROMO/NEWSLETTER --- */}
      <section className="py-20 bg-green-900 relative isolate overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#80ffbc] to-[#89fc00] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Join the Mogols Family</h2>
          <p className="text-green-100 max-w-2xl mx-auto mb-10 text-lg">
            Unlock 15% off your first order when you subscribe. Get exclusive access to new organic harvests and health tips.
          </p>

          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-full text-zinc-900 focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/60"
            />
            <button className="px-8 py-4 bg-white text-green-900 font-bold rounded-full hover:bg-green-50 transition shadow-lg whitespace-nowrap">
              Subscribe Now
            </button>
          </form>
          <p className="text-xs text-green-200 mt-6">We care about your data in our privacy policy.</p>
        </div>
      </section>

    </div>
  );
}
