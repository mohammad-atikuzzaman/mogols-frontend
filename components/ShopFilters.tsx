'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState, useTransition } from 'react';

const categories = ["Honey", "Oil", "Fruits", "Seeds", "Sweets"];

export default function ShopFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('keyword') || '');
    const selectedCategory = searchParams.get('category') || '';

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set('keyword', value);
        } else {
            params.delete('keyword');
        }
        startTransition(() => {
            router.push(`/shop?${params.toString()}`);
        });
    };

    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams);
        if (category) {
            params.set('category', category);
        } else {
            params.delete('category');
        }
        startTransition(() => {
            router.push(`/shop?${params.toString()}`);
        });
    };

    return (
        <div className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Shop All Products</h1>

                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400" />
                    </div>

                    {/* Category Pills */}
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                        <button
                            onClick={() => handleCategoryChange('')}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedCategory === ''
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100'
                                }`}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedCategory === cat
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
