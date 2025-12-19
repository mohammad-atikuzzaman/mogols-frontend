'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import productService from '@/services/productService';
import { ArrowLeft, Save } from 'lucide-react';

export default function CreateProductPage() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await productService.createProduct({
                name,
                price,
                image,
                brand,
                category,
                description,
                countInStock,
            });
            router.push('/admin/products');
        } catch (error) {
            console.error("Error creating product", error);
            alert("Failed to create product");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <Link href="/admin/products" className="flex items-center text-zinc-500 hover:text-zinc-700 mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Products
            </Link>

            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Create New Product</h1>

            <form onSubmit={submitHandler} className="space-y-6 bg-white dark:bg-zinc-900 shadow rounded-lg p-8">
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
                    <input
                        type="text"
                        placeholder="Enter product name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-950"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Price (Tk)</label>
                        <input
                            type="number"
                            placeholder="Enter price"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            required
                            min="0"
                            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-950"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Count In Stock</label>
                        <input
                            type="number"
                            placeholder="Enter stock quantity"
                            value={countInStock}
                            onChange={(e) => setCountInStock(Number(e.target.value))}
                            required
                            min="0"
                            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-950"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Image URL</label>
                    <input
                        type="text"
                        placeholder="Enter image url (e.g., /images/product.jpg)"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-950"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Brand</label>
                        <input
                            type="text"
                            placeholder="Enter brand"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-950"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Category</label>
                        <input
                            type="text"
                            placeholder="Enter category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-950"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
                    <textarea
                        rows={4}
                        placeholder="Enter product description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-950"
                    ></textarea>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isSubmitting ? 'Creating...' : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
}
