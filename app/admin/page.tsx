'use client';

import { useEffect, useState, useMemo } from 'react';
import {
    Package,
    User as UserIcon,
    DollarSign,
    ShoppingBag,
    Users as UsersIcon,
    TrendingUp,
    TrendingDown,
    Activity,
    Calendar,
    ArrowUpRight,
    CreditCard
} from 'lucide-react';
import dashboardService from '@/services/dashboardService';
import { useRouter } from 'next/navigation';
import { getSession } from '@/app/actions/auth';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color, description }: any) => (
    <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-2">{value}</h3>
            </div>
            <div className={cn("p-3 rounded-lg", color)}>
                <Icon className="w-5 h-5 text-white" />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            {trend === 'up' ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center font-medium">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {trendValue}
                </span>
            ) : trend === 'down' ? (
                <span className="text-rose-600 dark:text-rose-400 flex items-center font-medium">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    {trendValue}
                </span>
            ) : (
                <span className="text-zinc-500 dark:text-zinc-400 flex items-center">
                    <Activity className="w-4 h-4 mr-1" />
                    No change
                </span>
            )}
            <span className="text-zinc-400 dark:text-zinc-500 ml-2">{description}</span>
        </div>
    </div>
);

export default function AdminDashboard() {
    const [stats, setStats] = useState<{
        totalSales: number;
        activeOrders: number;
        totalCustomers: number;
        totalProducts: number;
        recentOrders: any[];
    }>({
        totalSales: 0,
        activeOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
        recentOrders: [],
    });
    const [chartData, setChartData] = useState<{ salesData: any[], statusData: any[] }>({ salesData: [], statusData: [] });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await dashboardService.getSummary();

                // Backend return format:
                // { totalSales, activeOrders, totalOrders, totalCustomers, totalProducts, salesData, orderStatusData, recentOrders }

                setStats({
                    totalSales: data.totalSales || 0,
                    activeOrders: data.activeOrders || 0,
                    totalCustomers: data.totalCustomers || 0,
                    totalProducts: data.totalProducts || 0,
                    recentOrders: data.recentOrders || []
                });

                // Map backend order status to chart colors
                const statusData = data.orderStatusData.map((item: any) => {
                    let color = '#f59e0b'; // default warning
                    if (item.name.includes('Delivered')) color = '#10b981'; // success
                    if (item.name.includes('Paid')) color = '#3b82f6'; // info
                    return {
                        ...item,
                        color
                    };
                });

                setChartData({
                    salesData: data.salesData || [],
                    statusData: statusData || []
                });

            } catch (error) {
                console.error("Error fetching admin stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Placeholder data for consistent rendering before fetch if needed (optional)
    const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

    return (
        <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-900/50 p-6 md:p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Dashboard Overview</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">Welcome back, Admin. Here's what's happening with your store today.</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-zinc-500">Loading dashboard data...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatsCard
                            title="Total Sales"
                            value={`Tk ${stats.totalSales.toLocaleString()}`}
                            icon={DollarSign}
                            color="bg-emerald-600"
                            trend="up"
                            trendValue="+12.5%"
                            description="from last month"
                        />
                        <StatsCard
                            title="Active Orders"
                            value={stats.activeOrders}
                            icon={Package}
                            color="bg-blue-600"
                            trend="down"
                            trendValue="-2.1%"
                            description="from last week"
                        />
                        <StatsCard
                            title="Total Customers"
                            value={stats.totalCustomers}
                            icon={UsersIcon}
                            color="bg-indigo-600"
                            trend="up"
                            trendValue="+4.3%"
                            description="new registrations"
                        />
                        <StatsCard
                            title="Total Products"
                            value={stats.totalProducts}
                            icon={ShoppingBag}
                            color="bg-purple-600"
                            trend="neutral"
                            trendValue="0%"
                            description="inventory stable"
                        />
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Revenue Chart */}
                        <div className="lg:col-span-2 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Revenue Analytics</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Sales performance over the last 7 days</p>
                            </div>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData.salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E4E7" className="dark:opacity-20" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#71717a', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#71717a', fontSize: 12 }}
                                            tickFormatter={(value) => `Tk ${value}`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                borderRadius: '8px',
                                                border: '1px solid #e4e4e7',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                            }}
                                            itemStyle={{ color: '#18181b' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="sales"
                                            stroke="#4f46e5"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorSales)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Order Status Chart */}
                        <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Order Status Distribution</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Current order fulfillment status</p>
                            </div>
                            <div className="h-64 w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData.statusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {chartData.statusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Center Text Effect */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                                    <div className="text-center">
                                        <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{stats.activeOrders}</span>
                                        <p className="text-xs text-zinc-500 uppercase font-medium">Pending</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links / Recent Activity placeholder */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-md relative overflow-hidden group hover:scale-[1.01] transition-transform cursor-pointer" onClick={() => router.push('/admin/products')}>
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-2">Manage Products</h3>
                                <p className="text-indigo-100 mb-6 max-w-xs">Add new items, update inventory, or change prices to keep your store fresh.</p>
                                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                                    Go to Products <ArrowUpRight className="ml-2 w-4 h-4" />
                                </button>
                            </div>
                            <ShoppingBag className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
                        </div>

                        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 dark:from-zinc-800 dark:to-zinc-950 rounded-xl p-6 text-white shadow-md relative overflow-hidden group hover:scale-[1.01] transition-transform cursor-pointer" onClick={() => router.push('/admin/orders')}>
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-2">Process Orders</h3>
                                <p className="text-zinc-400 mb-6 max-w-xs">Review pending orders, print shipping labels, and track deliveries.</p>
                                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                                    View Orders <ArrowUpRight className="ml-2 w-4 h-4" />
                                </button>
                            </div>
                            <Package className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
