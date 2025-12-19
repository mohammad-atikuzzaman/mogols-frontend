import ProductCard from '@/components/ProductCard';
import ShopFilters from '@/components/ShopFilters';
import productService from '@/services/productService';

interface Props {
    searchParams: Promise<{ keyword?: string; category?: string }>;
}

export default async function ShopPage({ searchParams }: Props) {
    const params = await searchParams;
    const keyword = params.keyword || '';
    const category = params.category || '';

    // Fetch products from server
    let products = await productService.getProducts(keyword);

    // Filter by category if specified
    if (category) {
        products = products.filter((p: any) => p.category === category);
    }

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen">
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
