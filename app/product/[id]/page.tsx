import Link from "next/link";
import Image from "next/image";
import { Star, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import AddToCart from "@/components/AddToCart";
import ProductReviews from "@/components/ProductReviews";
import RelatedProducts from "@/components/RelatedProducts";
import type { Metadata } from "next";

import productService from "@/services/productService";
import { getSession } from "@/app/actions/auth";

async function getProduct(id: string) {
    try {
        return await productService.getProductById(id);
    } catch (error) {
        return null;
    }
}

async function getRelated(id: string) {
    try {
        return await productService.getRelatedProducts(id);
    } catch (error) {
        return [];
    }
}

// Params type for Next.js 15+ / 16
interface Props {
    params: Promise<{ id: string }>;
}

// Generate dynamic metadata for each product
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    return {
        title: product.name,
        description: product.description || `Buy ${product.name} - 100% organic and pure. Available at Mogols.`,
        keywords: [product.name, product.category, 'organic', 'natural', 'pure', 'mogols'],
        openGraph: {
            title: `${product.name} | Mogols`,
            description: product.description,
            images: [
                {
                    url: product.image,
                    width: 800,
                    height: 800,
                    alt: product.name,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description,
            images: [product.image],
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const { id } = await params;
    const product = await getProduct(id);
    const relatedProducts = await getRelated(id);
    const session = await getSession();

    if (!product) {
        return <div className="container mx-auto px-4 py-20 text-center">Product not found</div>;
    }

    // Product structured data
    const productStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.image,
        description: product.description,
        sku: product._id,
        brand: {
            '@type': 'Brand',
            name: 'Mogols',
        },
        offers: {
            '@type': 'Offer',
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mogols.com'}/product/${product._id}`,
            priceCurrency: 'BDT',
            price: product.price,
            itemCondition: 'https://schema.org/NewCondition',
            availability: product.countInStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
        aggregateRating: product.numReviews > 0 ? {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.numReviews,
        } : undefined,
    };

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
                name: 'Shop',
                item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mogols.com'}/shop`,
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: product.name,
                item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mogols.com'}/product/${product._id}`,
            },
        ],
    };

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen">
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
            />
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <nav className="flex mb-8 text-sm text-zinc-500">
                    <Link href="/" className="hover:text-indigo-600">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/shop" className="hover:text-indigo-600">Shop</Link>
                    <span className="mx-2">/</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-medium">{product.name}</span>
                </nav>

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
                    {/* Image Gallery */}
                    <div className="flex flex-col-reverse">
                        <div className="aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 relative">
                            <Image
                                src={product.image}
                                alt={`${product.name} - ${product.description}`}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover object-center rounded-2xl"
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{product.name}</h1>

                        <div className="mt-3 flex items-center">
                            <div className="flex items-center">
                                {[0, 1, 2, 3, 4].map((rating) => (
                                    <Star
                                        key={rating}
                                        className={`h-5 w-5 flex-shrink-0 ${product.rating > rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-300 dark:text-zinc-600'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="ml-3 text-sm text-zinc-500">{product.numReviews} reviews</p>
                        </div>

                        <div className="mt-6">
                            <h2 className="sr-only">Product information</h2>
                            <p className="text-3xl tracking-tight text-zinc-900 dark:text-zinc-100">Tk {product.price}</p>
                        </div>

                        <div className="mt-6">
                            <h3 className="sr-only">Description</h3>
                            <p className="text-base text-zinc-700 dark:text-zinc-300 line-clamp-3 md:line-clamp-none">
                                {product.description}
                            </p>
                        </div>

                        <div className="mt-8 flex flex-col space-y-4">
                            <div className="flex items-center gap-4 text-sm text-zinc-500">
                                <div className="flex items-center gap-2">
                                    <Truck className="h-5 w-5 text-indigo-600" />
                                    <span>Fast Delivery</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-indigo-600" />
                                    <span>Authentic & Pure</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RefreshCw className="h-5 w-5 text-indigo-600" />
                                    <span>Easy Returns</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10">
                            <AddToCart product={{
                                _id: product._id,
                                name: product.name,
                                image: product.image,
                                price: product.price,
                                countInStock: product.countInStock
                            }} />
                        </div>

                        <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-8">
                            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Category</h3>
                            <p className="mt-2 text-sm text-zinc-500">{product.category}</p>
                        </div>

                    </div>
                </div>

                {/* Reviews Section */}
                <ProductReviews
                    reviews={product.reviews}
                    productId={product._id}
                    currentUser={session}
                />

                {/* Related Products Section */}
                <RelatedProducts products={relatedProducts} />
            </div>
        </div>
    );
}
