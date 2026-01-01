'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import productService from '@/services/productService';
import { ArrowLeft } from 'lucide-react';

export default function EditProductPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);
    const router = useRouter();
    const productId = params.id;

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product = await productService.getProductById(productId);
                setName(product.name);
                setPrice(product.price);
                setImage(product.image);
                setBrand(product.brand);
                setCategory(product.category);
                setCountInStock(product.countInStock);
                setDescription(product.description);
            } catch (error) {
                console.error("Error fetching product", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await productService.updateProduct({
                _id: productId,
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
            console.error("Error updating product", error);
            alert("Failed to update product");
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <Link href="/admin/products" className="flex items-center text-zinc-500 hover:text-zinc-700 mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Products
            </Link>

            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Edit Product</h1>

            <form onSubmit={submitHandler} className="space-y-6 bg-white dark:bg-zinc-900 shadow rounded-lg p-8">
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
                    <input
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-950"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Price</label>
                    <input
                        type="number"
                        placeholder="Enter price"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-950"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Image</label>
                    <input
                        type="text"
                        placeholder="Enter image url"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-950"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Brand</label>
                    <input
                        type="text"
                        placeholder="Enter brand"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-950"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Count In Stock</label>
                    <input
                        type="number"
                        placeholder="Enter stock"
                        value={countInStock}
                        onChange={(e) => setCountInStock(Number(e.target.value))}
                        className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-950"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-950"
                    >
                        <option value="">Select Category</option>
                        <option value="Honey">Honey</option>
                        <option value="Oils">Oils</option>
                        <option value="Seeds">Seeds</option>
                        <option value="Ghee">Ghee</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Others">Others</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
                    <textarea
                        rows={4}
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-zinc-950"
                    ></textarea>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Update Product
                    </button>
                </div>
            </form>
        </div>
    );
}
