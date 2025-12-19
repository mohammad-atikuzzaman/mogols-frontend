import Link from "next/link";
import { Star } from "lucide-react";

interface ProductProps {
    _id: string;
    name: string;
    image: string;
    price: number;
    rating: number;
    numReviews: number;
}

export default function ProductCard({ product }: { product: ProductProps }) {
    return (
        <Link href={`/product/${product._id}`} className="group relative block overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {/* Replace with Next/Image and actual image src handling later */}
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                {/* Badge or overlay could go here */}
            </div>

            <div className="p-4">
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {product.name}
                </h3>

                <div className="mt-2 flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        {product.rating} ({product.numReviews})
                    </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                        Tk {product.price}
                    </p>
                    <button className="rounded-full bg-zinc-100 p-2 text-zinc-900 transition hover:bg-indigo-600 hover:text-white dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-indigo-600">
                        <span className="sr-only">Add to cart</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </Link>
    );
}
