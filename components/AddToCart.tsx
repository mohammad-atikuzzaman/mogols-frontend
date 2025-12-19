'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/cartSlice';
import { useRouter } from 'next/navigation';

interface Product {
    _id: string;
    name: string;
    image: string;
    price: number;
    countInStock: number;
}

export default function AddToCart({ product }: { product: Product }) {
    const [qty, setQty] = useState(1);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        router.push('/cart');
    };

    return (
        <div className="flex gap-4 items-center">
            {product.countInStock > 0 && (
                <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-md">
                    <button
                        type="button"
                        className="px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
                        onClick={() => setQty(q => Math.max(1, q - 1))}
                        disabled={qty <= 1}
                    >
                        -
                    </button>
                    <span className="px-4 py-3 text-zinc-900 dark:text-zinc-100 font-medium border-l border-r border-zinc-300 dark:border-zinc-700 min-w-[3rem] text-center">
                        {qty}
                    </span>
                    <button
                        type="button"
                        className="px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
                        onClick={() => setQty(q => Math.min(product.countInStock, q + 1))}
                        disabled={qty >= product.countInStock}
                    >
                        +
                    </button>
                </div>
            )}

            <button
                onClick={addToCartHandler}
                disabled={product.countInStock === 0}
                className="flex-1 flex items-center justify-center rounded-full border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    );
}
