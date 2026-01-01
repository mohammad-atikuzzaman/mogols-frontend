import Link from "next/link";
import ProductCard from "../components/ProductCard";
import { ArrowRight, Leaf, ShieldCheck, Truck } from "lucide-react";

import productService from "../services/productService";

export default async function Home() {
  const products: any[] = await productService.getProducts();
  const featuredProducts = products.slice(0, 4); // Show top 4
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-100 dark:from-zinc-900 dark:to-zinc-800 -z-10" />
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-green-800 uppercase bg-green-200 rounded-full dark:bg-green-900 dark:text-green-100">
              100% Organic & Pure
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Discover Nature's <br /> <span className="text-green-600 dark:text-green-400">Finest Gifts</span>
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto md:mx-0">
              Authentic honey, fresh fruits, organic oils, and nutritious seeds delivered straight to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/shop" className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-green-600 rounded-full hover:bg-green-700 transition duration-300 shadow-lg hover:shadow-green-500/30">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/about" className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-green-700 bg-white border border-green-200 rounded-full hover:bg-green-50 transition duration-300 dark:bg-zinc-800 dark:text-green-400 dark:border-zinc-700 dark:hover:bg-zinc-700">
                Learn More
              </Link>
            </div>
          </div>

          {/* Abstract Shape or Image Placeholder */}
          <div className="flex-1 relative h-[400px] w-full hidden md:block">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559740509-8202abdaa7df?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center rounded-3xl rotate-3 shadow-2xl opacity-90 hover:rotate-0 transition duration-500"></div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition hover:-translate-y-1">
              <Leaf className="h-10 w-10 text-green-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">100% Organic</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Certified organic products sourced directly from nature without harmful chemicals.</p>
            </div>
            <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition hover:-translate-y-1">
              <ShieldCheck className="h-10 w-10 text-green-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Authentic & Pure</h3>
              <p className="text-zinc-600 dark:text-zinc-400">We guarantee purity. No adulteration, just nature's goodness in every package.</p>
            </div>
            <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition hover:-translate-y-1">
              <Truck className="h-10 w-10 text-green-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Quick and safe delivery across the country to keep products fresh.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Featured Products</h2>
              <p className="text-zinc-600 dark:text-zinc-400">Handpicked favorites just for you</p>
            </div>
            <Link href="/shop" className="hidden md:flex items-center text-green-600 hover:text-green-700 font-medium">
              View All Products <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link href="/shop" className="inline-flex items-center text-green-600 hover:text-green-700 font-medium">
              View All Products <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-green-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Mogols Family</h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">Subscribe for exclusive offers, health tips, and new product announcements.</p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input type="email" placeholder="Enter your email" className="flex-1 px-6 py-3 rounded-full text-zinc-900 focus:outline-none focus:ring-2 focus:ring-green-400" />
            <button type="button" className="px-8 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-full transition shadow-lg">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}
