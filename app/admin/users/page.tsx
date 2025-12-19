'use client';

import { useEffect, useState } from 'react';
import userService from '@/services/userService';
import { Trash2, Check, X } from 'lucide-react';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
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

    const deleteHandler = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userService.deleteUser(id);
                fetchUsers();
            } catch (error) {
                console.error("Error deleting user", error);
                alert("Could not delete user");
            }
        }
    }

    if (loading) return <div className="p-10 text-center">Loading users...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Users</h1>

            <div className="bg-white dark:bg-zinc-950 shadow overflow-hidden sm:rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                    <thead className="bg-zinc-50 dark:bg-zinc-900">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Admin</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Seller</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-950 divide-y divide-zinc-200 dark:divide-zinc-800">
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">{user._id.substring(0, 10)}...</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-zinc-100">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                    <a href={`mailto:${user.email}`} className="text-indigo-600 hover:text-indigo-900">{user.email}</a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                    {user.role === 'admin' ? (
                                        <Check className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <X className="h-5 w-5 text-red-500" />
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                    {user.role === 'seller' ? (
                                        <Check className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <X className="h-5 w-5 text-red-500" />
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => deleteHandler(user._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
