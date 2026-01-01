'use client';

import { useEffect, useState, useMemo } from 'react';
import userService from '@/services/userService';
import {
    Trash2,
    Check,
    X,
    Shield,
    ShieldCheck,
    User as UserIcon,
    Search,
    Mail,
    Calendar,
    MoreHorizontal
} from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility Components ---
function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' }) => {
    const variants = {
        default: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
        success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
        warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
        danger: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
        purple: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    };
    return (
        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", variants[variant])}>
            {children}
        </span>
    );
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteHandler = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete user "${name}"? This action cannot be undone.`)) {
            try {
                await userService.deleteUser(id);
                fetchUsers();
            } catch (error) {
                console.error("Error deleting user", error);
                alert("Could not delete user");
            }
        }
    }



    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());

            if (roleFilter === 'all') return matchesSearch;
            if (roleFilter === 'admin') return matchesSearch && (user.role === 'admin' || user.isAdmin);
            if (roleFilter === 'user') return matchesSearch && (user.role !== 'admin' && !user.isAdmin);

            return matchesSearch;
        });
    }, [users, searchTerm, roleFilter]);

    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    return (
        <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-900/50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">User Management</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage user access and permissions.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-1">
                        {['all', 'admin', 'user'].map((role) => (
                            <button
                                key={role}
                                onClick={() => setRoleFilter(role as any)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize",
                                    roleFilter === role
                                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm"
                                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                )}
                            >
                                {role}s
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white dark:bg-zinc-950 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                                <tr>
                                    <th className="px-6 py-4 font-medium">User</th>
                                    <th className="px-6 py-4 font-medium">Role</th>
                                    <th className="px-6 py-4 font-medium">Joined Date</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">Loading users...</td>
                                    </tr>
                                ) : paginatedUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">No users found.</td>
                                    </tr>
                                ) : (
                                    paginatedUsers.map((user) => (
                                        <tr key={user._id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-zinc-900 dark:text-zinc-100">{user.name}</div>
                                                        <div className="text-xs text-zinc-500 flex items-center gap-1">
                                                            <Mail className="w-3 h-3" />
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.role === 'admin' ? (
                                                    <Badge variant="purple">
                                                        <ShieldCheck className="w-3 h-3 mr-1" />
                                                        Administrator
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="default">
                                                        <UserIcon className="w-3 h-3 mr-1" />
                                                        Customer
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-500">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-zinc-400" />
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => deleteHandler(user._id, user.name)}
                                                    className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors group-hover:visible"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm(`Are you sure you want to change ${user.name}'s role?`)) {
                                                            try {
                                                                const newRole = user.role === 'admin' ? 'user' : 'admin';
                                                                await userService.updateUser({ ...user, role: newRole });
                                                                fetchUsers();
                                                            } catch (error) {
                                                                console.error("Error updating role", error);
                                                                alert("Failed to update role");
                                                            }
                                                        }
                                                    }}
                                                    className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors group-hover:visible"
                                                    title={user.role === 'admin' ? "Revoke Admin" : "Make Admin"}
                                                >
                                                    <Shield className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
                            <span className="text-xs text-zinc-500">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border border-zinc-300 dark:border-zinc-700 rounded-md text-xs font-medium disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border border-zinc-300 dark:border-zinc-700 rounded-md text-xs font-medium disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
