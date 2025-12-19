'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { savePaymentMethod } from '@/store/cartSlice';
import { useRouter } from 'next/navigation';
import { CreditCard } from 'lucide-react';

export default function PaymentPage() {
    const cart = useAppSelector((state) => state.cart);
    const { shippingAddress } = cart;
    const dispatch = useAppDispatch();
    const router = useRouter();

    if (!shippingAddress.address) {
        router.push('/shipping');
    }

    const [paymentMethod, setPaymentMethod] = useState('COD');

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        router.push('/placeorder');
    };

    return (
        <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-lg">
                <div className="bg-white dark:bg-zinc-900 shadow rounded-lg p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
                            <CreditCard className="h-6 w-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Payment Method</h1>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div>
                            <legend className="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-4">Select Method</legend>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        id="COD"
                                        name="paymentMethod"
                                        type="radio"
                                        className="h-4 w-4 border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <label htmlFor="COD" className="ml-3 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                        Cash on Delivery
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
