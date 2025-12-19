'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart, removeFromCart, CartItem } from '@/store/cartSlice';
import Link from 'next/link';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getSession } from '@/app/actions/auth';

export default function CartPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const cart = useAppSelector((state) => state.cart);
    const { cartItems } = cart;

    const removeFromCartHandler = (id: string) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = async () => {
        const session = await getSession();
        if (session) {
            router.push('/shipping');
        } else {
            router.push('/login?redirect=/shipping');
        }
    };

    const updateQty = (item: CartItem, qty: number) => {
        if (qty > 0 && qty <= item.countInStock) {
            dispatch(addToCart({ ...item, qty }));
        }
    }

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen">
            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-8">Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
                        <ShoppingBag className="mx-auto h-16 w-16 text-zinc-400 mb-4" />
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Your cart is empty</h2>
                        <p className="text-zinc-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                        <Link href="/shop" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                        <section className="lg:col-span-7">
                            <ul className="divide-y divide-zinc-200 dark:divide-zinc-700 border-t border-b border-zinc-200 dark:border-zinc-700">
                                {cartItems.map((item) => (
                                    <li key={item._id} className="flex py-6 sm:py-10">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32 border border-zinc-200 dark:border-zinc-700"
                                            />
                                        </div>

                                        <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                            <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                                <div>
                                                    <div className="flex justify-between">
                                                        <h3 className="text-sm">
                                                            <Link href={`/product/${item._id}`} className="font-medium text-zinc-700 dark:text-zinc-200 hover:text-indigo-600">
                                                                {item.name}
                                                            </Link>
                                                        </h3>
                                                    </div>
                                                    <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">Tk {item.price}</p>
                                                </div>

                                                <div className="mt-4 sm:mt-0 sm:pr-9">
                                                    <label htmlFor={`quantity-${item._id}`} className="sr-only">
                                                        Quantity, {item.name}
                                                    </label>

                                                    <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-md max-w-min">
                                                        <button
                                                            type="button"
                                                            className="px-3 py-1 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                            onClick={() => updateQty(item, item.qty - 1)}
                                                            disabled={item.qty <= 1}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-3 py-1 text-zinc-900 dark:text-zinc-100 font-medium border-l border-r border-zinc-300 dark:border-zinc-700">
                                                            {item.qty}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="px-3 py-1 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                            onClick={() => updateQty(item, item.qty + 1)}
                                                            disabled={item.qty >= item.countInStock}
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <div className="absolute top-0 right-0">
                                                        <button
                                                            type="button"
                                                            className="-m-2 inline-flex p-2 text-zinc-400 hover:text-red-500"
                                                            onClick={() => removeFromCartHandler(item._id)}
                                                        >
                                                            <span className="sr-only">Remove</span>
                                                            <Trash2 className="h-5 w-5" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Order Summary */}
                        <section
                            className="mt-16 rounded-lg bg-zinc-50 dark:bg-zinc-900 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
                        >
                            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Order summary</h2>

                            <div className="mt-6 space-y-4">
                                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-700 pt-4">
                                    <div className="text-base font-medium text-zinc-900 dark:text-zinc-100">Order total</div>
                                    <div className="text-base font-medium text-zinc-900 dark:text-zinc-100">Tk {itemsPrice}</div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={checkoutHandler}
                                    className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-50"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}
