import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import useCart from "@/hooks/useAddToCart";
import NotificationMessage from "@/context/NotificationMessage";

export default function ProductShow({ auth, product, relatedProducts }) {
    const { addToCart, notification, clearNotification, isLoading } =
        useCart(auth);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Product Details
                </h2>
            }
        >
            <Head title={product.name} />
            {notification && (
                <NotificationMessage
                    message={notification.message}
                    type={notification.type}
                    onDismiss={clearNotification}
                />
            )}
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Back button */}
                    <Link
                        href={route("products.index")}
                        className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Back to Products
                    </Link>

                    {/* Product Details Card */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="md:flex">
                                {/* Product Image */}
                                <div className="md:w-1/2 p-4">
                                    <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover" // Changed from 'object-contain' to 'object-cover'
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src =
                                                        "https://via.placeholder.com/600x600?text=No+Image";
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                No Image Available
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="md:w-1/2 p-4">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {product.name}
                                    </h1>
                                    <div className="text-2xl text-blue-600 font-semibold mb-4">
                                        ${Number(product.price).toFixed(2)}
                                    </div>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                            Description
                                        </h3>
                                        <p className="text-gray-600 whitespace-pre-line">
                                            {product.description}
                                        </p>
                                    </div>

                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-12">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">
                                You May Also Like
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((related) => (
                                    <Link
                                        key={related.id}
                                        href={route(
                                            "products.show",
                                            related.id
                                        )}
                                        className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                                    >
                                        <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                                            {related.image ? (
                                                <img
                                                    src={related.image}
                                                    alt={related.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-gray-400">
                                                    No Image
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-medium text-gray-900 truncate">
                                                {related.name}
                                            </h4>
                                            <p className="text-blue-600 font-semibold">
                                                $
                                                {Number(related.price).toFixed(
                                                    2
                                                )}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
