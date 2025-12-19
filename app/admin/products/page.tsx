'use client';

import { Edit, Trash2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import productService from '@/services/productService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const router = useRouter();

    const fetchProducts = async () => {
        try {
            const data = await productService.getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products", error);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteHandler = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productService.deleteProduct(id);
                fetchProducts(); // Refresh list
            } catch (error) {
                console.error("Error deleting product", error);
                alert("Failed to delete product");
            }
        }
    };

    const createProductHandler = async () => {
        try {
            const product = await productService.createProduct();
            // Redirect to edit page
            router.push(`/admin/product/${product._id}/edit`);
        } catch (error) {
            console.error("Error creating product", error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Products</h1>
                <Link
                    href="/admin/product/create"
                    className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Link>
            </div>

            <div className="bg-white dark:bg-zinc-950 shadow overflow-hidden sm:rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                    <thead className="bg-zinc-50 dark:bg-zinc-900">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Price</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Category</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Stock</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-950 divide-y divide-zinc-200 dark:divide-zinc-800">
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-zinc-100">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">Tk {product.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">{product.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">{product.countInStock}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={`/admin/product/${product._id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block">
                                        <Edit className="h-5 w-5" />
                                    </Link>
                                    <button
                                        onClick={() => deleteHandler(product._id)}
                                        className="text-red-600 hover:text-red-900 inline-block"
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
