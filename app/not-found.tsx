import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                {/* 404 Animation */}
                <div className="mb-8">
                    <h1 className="text-[150px] md:text-[200px] font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent leading-none">
                        404
                    </h1>
                </div>

                {/* Error Message */}
                <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                        The page you're looking for doesn't exist or has been moved. Let's get you back on track!
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="mb-12 flex justify-center">
                    <div className="relative">
                        <div className="h-32 w-32 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                            <Search className="h-16 w-16 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="absolute -top-2 -right-2 h-8 w-8 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">!</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        <Home className="h-5 w-5" />
                        Go to Home
                    </Link>
                    <Link
                        href="/shop"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold border-2 border-zinc-200 dark:border-zinc-700 hover:border-green-600 dark:hover:border-green-500 transition-all transform hover:scale-105"
                    >
                        <Search className="h-5 w-5" />
                        Browse Products
                    </Link>
                </div>

                {/* Popular Links */}
                <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                        Popular Pages:
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/shop" className="text-green-600 dark:text-green-400 hover:underline text-sm">
                            Shop
                        </Link>
                        <Link href="/about" className="text-green-600 dark:text-green-400 hover:underline text-sm">
                            About Us
                        </Link>
                        <Link href="/contact" className="text-green-600 dark:text-green-400 hover:underline text-sm">
                            Contact
                        </Link>
                        <Link href="/dashboard" className="text-green-600 dark:text-green-400 hover:underline text-sm">
                            My Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
