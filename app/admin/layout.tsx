'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Users, ClipboardList } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSession } from '../actions/auth';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        async function checkAuth() {
            try {
                const session = await getSession();

                if (!session) {
                    router.push('/login?redirect=/admin');
                    return;
                }

                if (session.role !== 'admin') {
                    router.push('/');
                    return;
                }

                setIsAuthorized(true);
            } catch (error) {
                console.error('Auth check failed:', error);
                router.push('/login?redirect=/admin');
            } finally {
                setIsLoading(false);
            }
        }

        checkAuth();
    }, [router]);

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Products', href: '/admin/products', icon: ShoppingBag },
        { name: 'Orders', href: '/admin/orders', icon: ClipboardList },
        { name: 'Users', href: '/admin/users', icon: Users },
    ];

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-zinc-600 dark:text-zinc-400">Verifying admin access...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="flex h-screen bg-zinc-100 dark:bg-zinc-900">
            {/* Sidebar */}
            <div className="w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 hidden md:block">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-indigo-600">Admin Panel</h2>
                </div>
                <nav className="px-4 space-y-2 mt-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive
                                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50'
                                    }`}
                            >
                                <Icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
