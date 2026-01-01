'use client';

import Link from 'next/link';

interface Product {
    _id: string;
    name: string;
    image: string;
    price: number;
    rating: number;
    numReviews: number;
}

interface RelatedProductsProps {
    products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
    if (!products || products.length === 0) return null;

    return (
        <div className="mt-16 border-t border-zinc-200 dark:border-zinc-800 pt-16">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-8">
                Related Products
            </h2>

            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {products.map((product) => (
                    <div key={product._id} className="group relative">
                        <div className="aspect-square w-full overflow-hidden rounded-md bg-zinc-200 group-hover:opacity-75 lg:h-80">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                            />
                        </div>
                        <div className="mt-4 flex justify-between">
                            <div>
                                <h3 className="text-sm text-zinc-700 dark:text-zinc-200">
                                    <Link href={`/product/${product._id}`}>
                                        <span aria-hidden="true" className="absolute inset-0" />
                                        {product.name}
                                    </Link>
                                </h3>
                                <p className="mt-1 text-sm text-zinc-500">{product.rating} ★ ({product.numReviews})</p>
                            </div>
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Tk {product.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
