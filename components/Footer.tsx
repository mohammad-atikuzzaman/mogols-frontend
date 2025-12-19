import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Mogols</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Providing authentic, organic, and pure products for a healthier lifestyle. From honey to organic oils, we have it all.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                            Shop
                        </h3>
                        <ul className="space-y-2">
                            <li><Link href="/shop?category=honey" className="text-sm text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">Honey</Link></li>
                            <li><Link href="/shop?category=oil" className="text-sm text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">Organic Oils</Link></li>
                            <li><Link href="/shop?category=seeds" className="text-sm text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">Seeds</Link></li>
                            <li><Link href="/shop?category=fruits" className="text-sm text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">Fruits</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                            Support
                        </h3>
                        <ul className="space-y-2">
                            <li><Link href="/contact" className="text-sm text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">Contact Us</Link></li>
                            <li><Link href="/faq" className="text-sm text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">FAQs</Link></li>
                            <li><Link href="/shipping" className="text-sm text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">Shipping Info</Link></li>
                            <li><Link href="/returns" className="text-sm text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400">Returns</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                            Follow Us
                        </h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-zinc-400 hover:text-indigo-600">
                                <Facebook className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-zinc-400 hover:text-indigo-600">
                                <Instagram className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-zinc-400 hover:text-indigo-600">
                                <Twitter className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-zinc-200 pt-8 dark:border-zinc-800">
                    <p className="text-center text-xs text-zinc-500">
                        &copy; {new Date().getFullYear()} Mogols. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
