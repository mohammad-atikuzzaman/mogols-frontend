'use client';

import Link from 'next/link';
import { Package, User as UserIcon, LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSession, logoutUser } from '@/app/actions/auth';
import orderService from '@/services/orderService';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            const session = await getSession();
            if (!session) {
                router.push('/login');
            } else {
                setUser(session);
                try {
                    const myOrders = await orderService.getMyOrders();
                    setOrders(myOrders);
                } catch (error) {
                    console.error("Error fetching orders", error);
                }
            }
        }
        fetchData();
    }, [router]);

    const handleLogout = async () => {
        await logoutUser();
        router.push('/');
    };

    if (!user) return <div className="p-20 text-center">Loading...</div>;

    return (
        <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen py-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar / Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-zinc-900 shadow rounded-lg p-6">
                            <div className="flex flex-col items-center">
                                <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                                    <UserIcon className="h-10 w-10" />
                                </div>
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{user.name}</h2>
                                <p className="text-zinc-500 text-sm">{user.email}</p>
                                <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {user.role}
                                </div>
                            </div>

                            <hr className="my-6 border-zinc-200 dark:border-zinc-800" />

                            <nav className="space-y-2">
                                <Link href="/dashboard" className="flex items-center px-4 py-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 rounded-md font-medium">
                                    <Package className="mr-3 h-5 w-5" /> My Orders
                                </Link>
                                {user.role === 'admin' && (
                                    <Link href="/admin" className="flex items-center px-4 py-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md font-medium transition">
                                        <Settings className="mr-3 h-5 w-5" />
                                        Admin Panel
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md font-medium transition"
                                >
                                    <LogOut className="mr-3 h-5 w-5" /> Logout
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content - Orders */}
                    <div className="lg:col-span-3">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Order History</h2>

                        <div className="bg-white dark:bg-zinc-900 shadow overflow-hidden rounded-lg">
                            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {orders.map((order) => (
                                    <li key={order._id} className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="text-sm font-medium text-indigo-600">Order #{order._id}</p>
                                                <p className="text-sm text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                {order.isPaid ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Paid</span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Not Paid</span>
                                                )}
                                                {order.isDelivered ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Delivered</span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Processing</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-2">
                                            {order.orderItems && order.orderItems.map((item: any, index: number) => (
                                                <div key={index} className="text-sm text-zinc-700 dark:text-zinc-300">
                                                    {item.qty} x {item.name}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4">
                                            <p className="font-bold text-zinc-900 dark:text-zinc-100">Total: Tk {order.totalPrice}</p>
                                            <Link href={`/order/${order._id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                                View Details &rarr;
                                            </Link>
                                        </div>
                                    </li>
                                ))}
                                {orders.length === 0 && (
                                    <li className="p-6 text-center text-zinc-500">No orders found.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
