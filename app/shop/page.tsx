import ProductCard from '@/components/ProductCard';
import ShopFilters from '@/components/ShopFilters';
import productService from '@/services/productService';
import type { Metadata } from 'next';

interface Props {
    searchParams: Promise<{ keyword?: string; category?: string }>;
}

// Generate dynamic metadata based on search params
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const params = await searchParams;
    const keyword = params.keyword || '';
    const category = params.category || '';

    let title = 'Shop Organic Products';
    let description = 'Browse our wide selection of 100% organic and pure natural products. Authentic honey, fresh fruits, organic oils, and nutritious seeds.';

    if (keyword) {
        title = `Search results for "${keyword}"`;
        description = `Find organic products matching "${keyword}". Premium quality natural products at Mogols.`;
    } else if (category) {
        title = `${category.charAt(0).toUpperCase() + category.slice(1)} Products`;
        description = `Browse our selection of organic ${category}. 100% pure and natural products.`;
    }

    return {
        title,
        description,
        openGraph: {
            title: `${title} | Mogols`,
            description,
            images: ['/og-image.png'],
        },
    };
}

export default async function ShopPage({ searchParams }: Props) {
    const params = await searchParams;
    const keyword = params.keyword || '';
    const category = params.category || '';

    // Fetch products from server
    let products = [];
    try {
        products = await productService.getProducts(keyword);
    } catch (error) {
        console.error("Failed to fetch products:", error);
    }

    // Filter by category if specified
    if (category && Array.isArray(products)) {
        products = products.filter((p: any) => p.category === category);
    }

    // Ensure products is an array
    products = Array.isArray(products) ? products : [];

    // Breadcrumb structured data
    const breadcrumbStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: process.env.NEXT_PUBLIC_SITE_URL || 'https://mogols.com',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Shop',
                item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mogols.com'}/shop${category ? `?category=${category}` : ''}`,
            },
        ],
    };

    // Product listing structured data
    const productListingStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: products.slice(0, 10).map((product: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mogols.com'}/product/${product._id}`,
        })),
    };

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen">
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productListingStructuredData) }}
            />

            {/* Client Component for Filters */}
            <ShopFilters />

            {/* Product Grid - Server Rendered */}
            <div className="container mx-auto px-4 py-12">
                {products.length === 0 ? (
                    <div className="text-center py-20 text-zinc-500">
                        No products found. Try adjusting your search or filters.
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-zinc-500 mb-6">
                            Showing {products.length} product{products.length !== 1 ? 's' : ''}
                            {keyword && ` for "${keyword}"`}
                            {category && ` in ${category}`}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.map((product: any) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
