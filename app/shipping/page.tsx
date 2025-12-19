'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { saveShippingAddress } from '@/store/cartSlice';
import { useRouter } from 'next/navigation';
import { Truck } from 'lucide-react';
import { getSession } from '@/app/actions/auth';

export default function ShippingPage() {
    const cart = useAppSelector((state) => state.cart);
    const { shippingAddress } = cart;
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');

    // Auth check
    useEffect(() => {
        const checkAuth = async () => {
            const session = await getSession();
            if (!session) {
                router.push('/login?redirect=/shipping');
            }
        };
        checkAuth();
    }, [router]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        router.push('/payment');
    };

    return (
        <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-lg">
                <div className="bg-white dark:bg-zinc-900 shadow rounded-lg p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
                            <Truck className="h-6 w-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Shipping Address</h1>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Address</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-950"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">City</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-950"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Postal Code</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-950"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Country</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-950"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Continue to Payment
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
