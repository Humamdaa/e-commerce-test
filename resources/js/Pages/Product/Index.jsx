import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import NotificationMessage from "@/context/NotificationMessage";
import CartIcon from "@/Components/CartIcon";
import useCart from "@/hooks/useAddToCart";

export default function ProductIndex({ auth, products }) {
    const [showButton, setShowButton] = useState(false);
    const { addToCart, notification, clearNotification, isLoading } =
        useCart(auth);

    useEffect(() => {
        const handleScroll = () => {
            if (window.pageYOffset > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Products" />
            {notification && (
                <NotificationMessage
                    message={notification.message}
                    type={notification.type}
                    onDismiss={clearNotification}
                />
            )}
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {auth.user && (
                        <div className="flex justify-end mb-6">
                            <Link
                                href={route("products.create")}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                Create New Product
                            </Link>
                        </div>
                    )}
                    <header className="flex justify-between items-center p-4 bg-white shadow-sm">
                        <h1>Our Products</h1>
                        <div className="flex items-center space-x-4">
                            <CartIcon auth={auth} />
                        </div>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group"
                            >
                                {/* Product Image */}
                                <Link
                                    href={route("products.show", product.id)}
                                    className="block"
                                >
                                    <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src =
                                                        "https://via.placeholder.com/300x200?text=No+Image";
                                                }}
                                            />
                                        ) : (
                                            <span className="text-gray-400">
                                                No Image Available
                                            </span>
                                        )}
                                    </div>
                                </Link>

                                <button
                                    className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-blue-500 hover:text-white transition-colors duration-200"
                                    title="Add to cart"
                                    onClick={() => addToCart(product)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                </button>

                                {/* Product Info */}
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <Link
                                            href={route(
                                                "products.show",
                                                product.id
                                            )}
                                            className="group-hover:text-blue-600 transition-colors"
                                        >
                                            <h3 className="font-semibold text-gray-900 line-clamp-1">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        <span className="text-lg font-bold text-blue-600">
                                            ${Number(product.price).toFixed(2)}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {product.description}
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                        <div className="flex space-x-2">
                                            <Link
                                                // href={route(
                                                //     "products.edit",
                                                //     product.id
                                                // )}
                                                className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>
                                            </Link>
                                            <button className="text-xs text-gray-500 hover:text-red-600 transition-colors">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </div>

                                        <Link
                                            href={route(
                                                "products.show",
                                                product.id
                                            )}
                                            className="text-xs flex items-center text-blue-600 hover:text-blue-800"
                                        >
                                            <span>View Details</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-3 w-3 ml-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showButton && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-200 z-50"
                    aria-label="Back to top"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                    </svg>
                </button>
            )}
        </AuthenticatedLayout>
    );
}
