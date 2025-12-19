"use client";

import Link from "next/link";
import { ShoppingCart, User, Search, Menu, X, Home, Store, Info, Mail, LogOut, Settings, Package, LayoutDashboard, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import { useRouter, usePathname } from "next/navigation";
import { getSession, logoutUser } from "@/app/actions/auth";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [session, setSession] = useState<any>(null);

    const { cartItems } = useAppSelector((state) => state.cart);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const fetchSession = async () => {
            const user = await getSession();
            setSession(user);
        };
        fetchSession();
    }, [pathname]);

    const searchSubmitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        if (keyword.trim()) {
            router.push(`/shop?keyword=${keyword}`);
            setIsSearchOpen(false);
            setIsMenuOpen(false);
        } else {
            router.push('/shop');
        }
    };

    const handleLogout = async () => {
        await logoutUser();
    };

    const navLinks = [
        { href: "/", label: "Home", icon: Home },
        { href: "/shop", label: "Shop", icon: Store },
        { href: "/about", label: "About", icon: Info },
        { href: "/contact", label: "Contact", icon: Mail },
    ];

    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95 shadow-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:shadow-green-500/30 transition-shadow">
                            <span className="text-white font-bold text-sm">M</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            Mogols
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-1">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                    {/* Search */}
                    {isSearchOpen ? (
                        <form onSubmit={searchSubmitHandler} className="relative">
                            <input
                                type="text"
                                className="w-40 sm:w-60 rounded-full border border-zinc-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:bg-zinc-900 dark:border-zinc-700"
                                placeholder="Search products..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                autoFocus
                            />
                            <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-2 top-2.5 text-zinc-400 hover:text-red-500">
                                <X className="h-4 w-4" />
                            </button>
                        </form>
                    ) : (
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
                            title="Search"
                        >
                            <Search className="h-5 w-5" />
                        </button>
                    )}

                    {/* Cart */}
                    <Link
                        href="/cart"
                        className="relative h-9 w-9 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
                        title="Shopping Cart"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[11px] font-bold text-white shadow-lg animate-pulse">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* User Menu - Desktop */}
                    <div className="hidden md:block relative">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-2 h-9 px-3 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
                            title="Account"
                        >
                            <User className="h-5 w-5" />
                            {session && <span className="text-sm font-medium max-w-[100px] truncate">{session.name}</span>}
                            <ChevronDown className="h-3 w-3" />
                        </button>

                        {/* Dropdown */}
                        {isUserMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800 py-2 z-50">
                                    {session ? (
                                        <>
                                            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
                                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{session.name}</p>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{session.email}</p>
                                            </div>
                                            <Link
                                                href="/dashboard"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <LayoutDashboard className="h-4 w-4" />
                                                Dashboard
                                            </Link>

                                            {session.role === 'admin' && (
                                                <Link
                                                    href="/admin"
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <Settings className="h-4 w-4" />
                                                    Admin Panel
                                                </Link>
                                            )}
                                            <hr className="my-2 border-zinc-200 dark:border-zinc-800" />
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href="/login"
                                                className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Sign In
                                            </Link>
                                            <Link
                                                href="/register"
                                                className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Create Account
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden h-9 w-9 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    {/* Search in Mobile */}
                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                        <form onSubmit={searchSubmitHandler}>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:bg-zinc-900 dark:border-zinc-700"
                                placeholder="Search products..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </form>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col p-2">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Icon className="h-5 w-5" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section in Mobile */}
                    {session ? (
                        <div className="border-t border-zinc-200 dark:border-zinc-800 p-2">
                            <div className="px-4 py-3">
                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{session.name}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">{session.email}</p>
                            </div>
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <LayoutDashboard className="h-5 w-5" />
                                Dashboard
                            </Link>

                            {session.role === 'admin' && (
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Settings className="h-5 w-5" />
                                    Admin Panel
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <LogOut className="h-5 w-5" />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="border-t border-zinc-200 dark:border-zinc-800 p-2">
                            <Link
                                href="/login"
                                className="flex items-center justify-center px-4 py-3 mb-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium text-green-700 dark:text-green-400 border border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Create Account
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
