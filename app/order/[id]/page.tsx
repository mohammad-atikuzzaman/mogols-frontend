'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Truck, CreditCard, Calendar, ShoppingBag, ArrowLeft } from 'lucide-react';
import orderService from '@/services/orderService';
import { useRouter } from 'next/navigation';

interface Props {
    params: Promise<{ id: string }>;
}

export default function OrderPage({ params }: Props) {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [orderId, setOrderId] = useState('');
    const router = useRouter();

    useEffect(() => {
        async function fetchOrder() {
            try {
                const { id } = await params;
                setOrderId(id);
                const data = await orderService.getOrderById(id);
                setOrder(data);
            } catch (err: any) {
                console.error("Error fetching order:", err);
                setError(err?.response?.data?.message || 'Failed to load order');
            } finally {
                setLoading(false);
            }
        }
        fetchOrder();
    }, [params]);

    if (loading) {
        return (
            <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="animate-pulse">
                        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4 mx-auto mb-4"></div>
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Order Not Found</h2>
                    <p className="text-zinc-500 mb-6">{error || "The order you're looking for doesn't exist or you don't have permission to view it."}</p>
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-500 font-medium">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen py-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Order #{order._id}</h1>
                        <p className="text-zinc-500 mt-1 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <Link href="/dashboard" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-500 font-medium">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white dark:bg-zinc-900 shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                                <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                    <ShoppingBag className="h-5 w-5 text-indigo-500" /> Order Items
                                </h2>
                            </div>
                            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {order.orderItems.map((item: any) => (
                                    <li key={item.product || item._id} className="p-6 flex items-center">
                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className="flex justify-between text-base font-medium text-zinc-900 dark:text-zinc-100">
                                                <h3>
                                                    <Link href={`/product/${item.product}`} className="hover:text-indigo-600">{item.name}</Link>
                                                </h3>
                                                <p className="ml-4">Tk {item.price * item.qty}</p>
                                            </div>
                                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Qty: {item.qty}</p>
                                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Unit Price: Tk {item.price}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* Order Summary & Customer Info */}
                    <div className="space-y-6">
                        <section className="bg-white dark:bg-zinc-900 shadow rounded-lg p-6">
                            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">Order Summary</h2>
                            <dl className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                                <div className="flex justify-between">
                                    <dt>Items Total</dt>
                                    <dd className="font-medium text-zinc-900 dark:text-zinc-100">Tk {order.itemsPrice ? order.itemsPrice.toFixed(2) : '0'}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt>Shipping</dt>
                                    <dd className="font-medium text-zinc-900 dark:text-zinc-100">Tk {order.shippingPrice ? order.shippingPrice.toFixed(2) : '0'}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt>Tax</dt>
                                    <dd className="font-medium text-zinc-900 dark:text-zinc-100">Tk {order.taxPrice ? order.taxPrice.toFixed(2) : '0'}</dd>
                                </div>
                                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2 mt-2 flex justify-between text-base font-bold text-zinc-900 dark:text-zinc-100">
                                    <dt>Total</dt>
                                    <dd>Tk {order.totalPrice ? order.totalPrice.toFixed(2) : '0'}</dd>
                                </div>
                            </dl>
                        </section>

                        <section className="bg-white dark:bg-zinc-900 shadow rounded-lg p-6">
                            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                                <Truck className="h-5 w-5 text-indigo-500" /> Shipping Info
                            </h2>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                <p className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">{order.user?.name}</p>
                                <p>{order.shippingAddress?.address}</p>
                                <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                                <p>{order.shippingAddress?.country}</p>

                                <div className={`mt-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {order.isDelivered ? `Delivered at ${new Date(order.deliveredAt).toLocaleDateString()}` : 'Not Delivered'}
                                </div>
                            </div>
                        </section>

                        <section className="bg-white dark:bg-zinc-900 shadow rounded-lg p-6">
                            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-indigo-500" /> Payment Info
                            </h2>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                <p className="mb-2">Method: {order.paymentMethod}</p>
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {order.isPaid ? `Paid at ${new Date(order.paidAt).toLocaleDateString()}` : 'Not Paid'}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
