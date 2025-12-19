'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCart } from '@/store/cartSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import orderService from '@/services/orderService';
import { Truck, CreditCard, ShoppingBag } from 'lucide-react';

export default function PlaceOrderPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const cart = useAppSelector((state) => state.cart);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Calculate prices
    const addDecimals = (num: number) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    const itemsPrice = Number(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
    const shippingPrice = itemsPrice > 100 ? 0 : 100; // Free shipping over 100
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            router.push('/shipping');
        } else if (!cart.paymentMethod) {
            router.push('/payment');
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, router]);

    const placeOrderHandler = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await orderService.createOrder({
                orderItems: cart.cartItems.map((item) => ({
                    product: item._id,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    qty: item.qty,
                })),
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: itemsPrice,
                shippingPrice: shippingPrice,
                taxPrice: taxPrice,
                totalPrice: totalPrice,
            });
            dispatch(clearCart());
            router.push(`/order/${res._id}`);
        } catch (error: any) {
            console.error('Order creation error:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to place order. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen py-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">Place Order</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Details Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white dark:bg-zinc-900 shadow rounded-lg p-6">
                            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                                <Truck className="h-5 w-5 text-indigo-500" /> Shipping Info
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                            </p>
                        </section>

                        <section className="bg-white dark:bg-zinc-900 shadow rounded-lg p-6">
                            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-indigo-500" /> Payment Method
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                {cart.paymentMethod}
                            </p>
                        </section>

                        <section className="bg-white dark:bg-zinc-900 shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                                <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                    <ShoppingBag className="h-5 w-5 text-indigo-500" /> Order Items
                                </h2>
                            </div>
                            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {cart.cartItems.map((item, index) => (
                                    <li key={index} className="p-6 flex items-center">
                                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className="flex justify-between text-base font-medium text-zinc-900 dark:text-zinc-100">
                                                <h3>
                                                    <Link href={`/product/${item._id}`}>{item.name}</Link>
                                                </h3>
                                                <p className="ml-4">Tk {item.price * item.qty}</p>
                                            </div>
                                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                                {item.qty} x Tk {item.price}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <section className="bg-white dark:bg-zinc-900 shadow rounded-lg p-6">
                            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">Order Summary</h2>
                            <dl className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                                <div className="flex justify-between">
                                    <dt>Items Total</dt>
                                    <dd className="font-medium text-zinc-900 dark:text-zinc-100">Tk {addDecimals(itemsPrice)}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt>Shipping</dt>
                                    <dd className="font-medium text-zinc-900 dark:text-zinc-100">Tk {addDecimals(shippingPrice)}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt>Tax</dt>
                                    <dd className="font-medium text-zinc-900 dark:text-zinc-100">Tk {addDecimals(taxPrice)}</dd>
                                </div>
                                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2 mt-2 flex justify-between text-base font-bold text-zinc-900 dark:text-zinc-100">
                                    <dt>Total</dt>
                                    <dd>Tk {addDecimals(totalPrice)}</dd>
                                </div>
                            </dl>

                            {error && (
                                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                                </div>
                            )}

                            <button
                                type="button"
                                className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={placeOrderHandler}
                                disabled={cart.cartItems.length === 0 || loading}
                            >
                                {loading ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
