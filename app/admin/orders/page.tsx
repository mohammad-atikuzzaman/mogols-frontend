'use client';

import { useEffect, useState, useMemo } from 'react';
import orderService from '@/services/orderService';
import Link from 'next/link';
import {
    Eye,
    Check,
    Truck,
    Search,
    Filter,
    ArrowUpDown,
    DollarSign,
    Package,
    Clock,
    MoreVertical,
    X,
    Calendar,
    ChevronLeft,
    ChevronRight,
    RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility Components ---

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn("bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm", className)}>
        {children}
    </div>
);

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' }) => {
    const variants = {
        default: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
        success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
        warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
        danger: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    };
    return (
        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", variants[variant])}>
            {children}
        </span>
    );
};

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    loading = false,
    disabled,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger', size?: 'sm' | 'md' | 'lg', loading?: boolean }) => {
    const variants = {
        primary: "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm",
        secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
        outline: "border border-zinc-300 bg-transparent hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300",
        ghost: "bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300",
        danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm",
    };
    const sizes = {
        sm: "px-2.5 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={loading || disabled}
            {...props}
        >
            {loading && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
            {children}
        </button>
    );
};

// --- Confirmation Modal ---

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading = false
}: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-md w-full p-6 border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} disabled={loading}>{cancelText}</Button>
                    <Button variant="primary" onClick={onConfirm} loading={loading}>{confirmText}</Button>
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Modal state
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        action: () => Promise<void>;
    }>({
        isOpen: false,
        title: '',
        message: '',
        action: async () => { },
    });
    const [actionLoading, setActionLoading] = useState(false);

    const router = useRouter();

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await orderService.getOrders();
            // Sort by date new to old by default
            const sortedData = Array.isArray(data) ? data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];
            setOrders(sortedData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [refreshTrigger]);

    // Filtering logic
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (order.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase());

            if (statusFilter === 'all') return matchesSearch;
            if (statusFilter === 'paid') return matchesSearch && order.isPaid;
            if (statusFilter === 'unpaid') return matchesSearch && !order.isPaid;
            if (statusFilter === 'delivered') return matchesSearch && order.isDelivered;
            if (statusFilter === 'processing') return matchesSearch && !order.isDelivered;

            return matchesSearch;
        });
    }, [orders, searchTerm, statusFilter]);

    // Pagination logic
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Stats
    const stats = useMemo(() => {
        const total = orders.length;
        const revenue = orders.reduce((acc, o) => acc + (o.isPaid ? o.totalPrice : 0), 0);
        const pending = orders.filter(o => !o.isDelivered).length;
        const completed = orders.filter(o => o.isDelivered).length;
        return { total, revenue, pending, completed };
    }, [orders]);

    // Handlers
    const handleAction = (title: string, message: string, actionFn: () => Promise<void>) => {
        setModalConfig({
            isOpen: true,
            title,
            message,
            action: actionFn
        });
    };

    const confirmAction = async () => {
        setActionLoading(true);
        try {
            await modalConfig.action();
            setRefreshTrigger(prev => prev + 1);
            setModalConfig(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
            console.error(error);
            alert("Action failed. Please try again."); // Fallback
        } finally {
            setActionLoading(false);
        }
    };

    const markAsDelivered = (orderId: string) => {
        handleAction(
            "Mark as Delivered",
            "Are you sure you want to mark this order as delivered? This will update the order status and notify the customer.",
            async () => await orderService.deliverOrder(orderId)
        );
    };

    const markAsPaid = (orderId: string) => {
        handleAction(
            "Mark as Paid",
            "Are you sure you want to manually mark this order as paid? This should only be done if you received payment outside the system (e.g. Cash On Delivery).",
            async () => {
                // Generate a manual payment transaction record
                const paymentResult = {
                    id: `MANUAL-${Date.now()}`,
                    status: 'COMPLETED',
                    update_time: String(Date.now()),
                    payer: { email_address: 'manual-entry@admin.system' }
                };
                await orderService.payOrder(orderId, paymentResult);
            }
        );
    };

    return (
        <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-900/50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Order Management</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage and track all customer orders</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => fetchOrders()} loading={loading}>
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-6 flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-2">
                                Tk {stats.revenue.toLocaleString()}
                            </h3>
                        </div>
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </Card>
                    <Card className="p-6 flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Orders</p>
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-2">{stats.total}</h3>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </Card>
                    <Card className="p-6 flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Pending Delivery</p>
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-2">{stats.pending}</h3>
                        </div>
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                    </Card>
                    <Card className="p-6 flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Completed</p>
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-2">{stats.completed}</h3>
                        </div>
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Truck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                    </Card>
                </div>

                {/* Filters & Controls */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search orders by ID, user, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-shadow"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="flex items-center gap-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-1">
                            {['all', 'paid', 'unpaid', 'delivered'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setStatusFilter(filter)}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize",
                                        statusFilter === filter
                                            ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm"
                                            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                    )}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Order ID</th>
                                    <th className="px-6 py-4 font-medium">Customer</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Payment</th>
                                    <th className="px-6 py-4 font-medium">Fulfillment</th>
                                    <th className="px-6 py-4 font-medium text-right">Total</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <RefreshCw className="w-6 h-6 animate-spin text-zinc-400" />
                                                <p>Loading orders...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : paginatedOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                                            No orders found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedOrders.map((order) => (
                                        <tr key={order._id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                                                <span title={order._id} className="font-mono text-xs text-zinc-500">
                                                    #{order._id.substring(order._id.length - 8).toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{order.user?.name || 'Guest'}</span>
                                                    <span className="text-xs text-zinc-500">{order.user?.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-500 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-zinc-400" />
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {order.isPaid ? (
                                                    <Badge variant="success">Paid</Badge>
                                                ) : (
                                                    <Badge variant="warning">Pending</Badge>
                                                )}
                                                {order.isPaid && (
                                                    <div className="text-xs text-zinc-500 mt-1">
                                                        {new Date(order.paidAt).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {order.isDelivered ? (
                                                    <Badge variant="success">Delivered</Badge>
                                                ) : (
                                                    <Badge variant="info">Processing</Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-zinc-900 dark:text-zinc-100">
                                                Tk {order.totalPrice.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {!order.isPaid && (
                                                        <button
                                                            onClick={() => markAsPaid(order._id)}
                                                            className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                                                            title="Mark as Paid"
                                                        >
                                                            <DollarSign className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {!order.isDelivered && (
                                                        <button
                                                            onClick={() => markAsDelivered(order._id)}
                                                            className="p-2 text-zinc-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                                            title="Mark as Delivered"
                                                        >
                                                            <Truck className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={`/order/${order._id}`}
                                                        className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                            <span className="text-xs text-zinc-500">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </Button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                        .map((page, i, arr) => (
                                            <>
                                                {i > 0 && arr[i - 1] !== page - 1 && (
                                                    <span className="text-zinc-400 text-xs px-1">...</span>
                                                )}
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={cn(
                                                        "w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors",
                                                        currentPage === page
                                                            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                                                            : "text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                                    )}
                                                >
                                                    {page}
                                                </button>
                                            </>
                                        ))
                                    }
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmAction}
                title={modalConfig.title}
                message={modalConfig.message}
                loading={actionLoading}
            />
        </div>
    );
}
