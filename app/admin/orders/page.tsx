'use client';

import { useEffect, useState } from 'react';
import orderService from '@/services/orderService';
import Link from 'next/link';
import { Eye, Check, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchOrders = async () => {
        try {
            const data = await orderService.getOrders();
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const markAsDelivered = async (orderId: string) => {
        if (window.confirm("Are you sure you want to mark this order as delivered?")) {
            try {
                await orderService.deliverOrder(orderId);
                fetchOrders(); // Refresh
            } catch (error) {
                console.error(error);
                alert("Failed to update order status");
            }
        }
    };

    const markAsPaid = async (orderId: string) => {
        if (window.confirm("Are you sure you want to mark this order as paid?")) {
            try {
                // Mock payment result for admin manual update
                const paymentResult = {
                    id: `admin-${Date.now()}`,
                    status: 'COMPLETED',
                    update_time: String(Date.now()),
                    payer: { email_address: 'admin@example.com' }
                };
                await orderService.payOrder(orderId, paymentResult);
                fetchOrders();
            } catch (error) {
                console.error(error);
                alert("Failed to update order status");
            }
        }
    }

    if (loading) return <div className="p-10 text-center">Loading orders...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Orders</h1>

            <div className="bg-white dark:bg-zinc-950 shadow overflow-hidden sm:rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                    <thead className="bg-zinc-50 dark:bg-zinc-900">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">User</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Total</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Paid</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Delivered</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-950 divide-y divide-zinc-200 dark:divide-zinc-800">
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">{order._id.substring(0, 10)}...</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-zinc-100">{order.user && order.user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">Tk {order.totalPrice}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                    {order.isPaid ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {new Date(order.paidAt).toLocaleDateString()}
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => markAsPaid(order._id)}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer"
                                            title="Mark as Paid"
                                        >
                                            No
                                        </button>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                    {order.isDelivered ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {new Date(order.deliveredAt).toLocaleDateString()}
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => markAsDelivered(order._id)}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer"
                                            title="Mark as Delivered"
                                        >
                                            No
                                        </button>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/order/${order._id}`} className="text-zinc-400 hover:text-zinc-600">
                                            <Eye className="h-5 w-5" />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
