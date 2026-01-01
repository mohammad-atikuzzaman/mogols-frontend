'use client';

import { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import productService from '@/services/productService';
import orderService from '@/services/orderService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Review {
    _id: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: string;
}

interface ProductReviewsProps {
    reviews: Review[];
    productId: string;
    currentUser: any;
}

export default function ProductReviews({ reviews, productId, currentUser }: ProductReviewsProps) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [canReview, setCanReview] = useState(false);
    const [checkingEligibility, setCheckingEligibility] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkEligibility = async () => {
            if (currentUser) {
                try {
                    const data = await orderService.checkPurchaseStatus(productId);
                    setCanReview(data.canReview);
                } catch (error) {
                    console.error("Error checking review eligibility", error);
                    setCanReview(false);
                } finally {
                    setCheckingEligibility(false);
                }
            } else {
                setCheckingEligibility(false);
            }
        };

        checkEligibility();
    }, [currentUser, productId]);

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            await productService.createReview(productId, { rating, comment });
            setMessage('Review submitted successfully!');
            setMessageType('success');
            setComment('');
            setRating(5);
            router.refresh();
        } catch (error: any) {
            setMessage(error.response?.data?.message || error.message || 'Failed to submit review');
            setMessageType('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-16 border-t border-zinc-200 dark:border-zinc-800 pt-16">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-8">
                Customer Reviews
            </h2>

            <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
                {/* Reviews List */}
                <div>
                    {reviews.length === 0 ? (
                        <p className="text-zinc-500 mb-8">No reviews yet.</p>
                    ) : (
                        <div className="flow-root">
                            <ul role="list" className="-my-12 divide-y divide-zinc-200 dark:divide-zinc-800">
                                {reviews.map((review) => (
                                    <li key={review._id} className="py-12">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                <User className="h-6 w-6 text-indigo-600" />
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{review.name}</h4>
                                                <div className="mt-1 flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${review.rating > i ? 'text-amber-400 fill-amber-400' : 'text-zinc-300 dark:text-zinc-600'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 space-y-6 text-base italic text-zinc-600 dark:text-zinc-300">
                                            <p>"{review.comment}"</p>
                                        </div>
                                        <p className="mt-2 text-xs text-zinc-500">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Write Review Form */}
                <div className="mt-16 lg:mt-0">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6">Write a Review</h3>

                    {!currentUser ? (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 p-4">
                            <p className="text-sm text-amber-700 dark:text-amber-200">
                                Please <Link href="/login" className="font-bold underline">login</Link> to write a review.
                            </p>
                        </div>
                    ) : checkingEligibility ? (
                        <div className="text-zinc-500">Checking eligibility...</div>
                    ) : !canReview ? (
                        <div className="bg-zinc-50 dark:bg-zinc-900 border-l-4 border-zinc-400 p-4">
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                You can only review products you have purchased.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={submitHandler} className="space-y-6">
                            {message && (
                                <div className={`p-4 rounded-md ${messageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {message}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Rating</label>
                                <select
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                    className="block w-full rounded-md border-zinc-300 dark:border-zinc-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-950 px-3 py-2"
                                >
                                    <option value="5">5 - Excellent</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="3">3 - Good</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="1">1 - Poor</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Comment</label>
                                <textarea
                                    rows={4}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                    className="block w-full rounded-md border-zinc-300 dark:border-zinc-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-950 px-3 py-2"
                                    placeholder="Share your thoughts about this product..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
