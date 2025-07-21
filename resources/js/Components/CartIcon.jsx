import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { useCartItems } from "@/hooks/useCartItems";

export default function CartIcon({ auth }) {
    const [isOpen, setIsOpen] = useState(false);
    const {
        cartItems,
        pendingChanges,
        fetchCartItems,
        updateCartItem,
        removeCartItem,
        saveCartChanges,
        isLoading,
    } = useCartItems(auth);

    useEffect(() => {
        if (isOpen) {
            fetchCartItems();
        }
    }, [isOpen]);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleCartToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            {/* Cart toggle button */}
            <button
                onClick={handleCartToggle}
                className="p-2 rounded-full hover:bg-gray-100 relative"
                aria-label="Cart"
                disabled={isLoading}
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
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>

                {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                    </span>
                )}
            </button>

            {/* Cart dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                    <div className="p-4">
                        <h3 className="font-bold text-lg mb-2">Your Cart</h3>

                        {isLoading ? (
                            <p className="text-gray-500">Loading cart...</p>
                        ) : cartItems.length === 0 ? (
                            <p className="text-gray-500">Your cart is empty</p>
                        ) : (
                            <>
                                <div className="max-h-64 overflow-y-auto">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center py-2 border-b border-gray-100"
                                        >
                                            <img
                                                src={
                                                    item.image ||
                                                    "https://via.placeholder.com/50"
                                                }
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                            <div className="ml-3 flex-1">
                                                <h4 className="font-medium">
                                                    {item.name}
                                                </h4>
                                                <div className="flex items-center mt-1">
                                                    <button
                                                        onClick={() =>
                                                            updateCartItem(
                                                                item.id,
                                                                item.quantity -
                                                                    1
                                                            )
                                                        }
                                                        className="w-6 h-6 flex items-center justify-center border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                                        disabled={
                                                            isLoading ||
                                                            item.quantity === 0
                                                        } // Disable if loading OR quantity is 0
                                                    >
                                                        -
                                                    </button>
                                                    <span className="mx-2 w-8 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateCartItem(
                                                                item.id,
                                                                item.quantity +
                                                                    1
                                                            )
                                                        }
                                                        className="w-6 h-6 flex items-center justify-center border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                                        disabled={
                                                            isLoading ||
                                                            item.quantity === 10
                                                        } // Disable if loading OR quantity is 10
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    $
                                                    {(
                                                        item.price *
                                                        item.quantity
                                                    ).toFixed(2)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    removeCartItem(item.id)
                                                }
                                                className="text-red-500 hover:text-red-700 ml-2 disabled:opacity-50"
                                                disabled={isLoading}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold">
                                            Total: ${cartTotal.toFixed(2)}
                                        </span>
                                        {pendingChanges.length > 0 && (
                                            <button
                                                onClick={saveCartChanges}
                                                className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 transition disabled:opacity-50"
                                                disabled={isLoading}
                                            >
                                                Save Changes
                                            </button>
                                        )}
                                    </div>
                                    <Link
                                        // href={route("cart.view")}
                                        className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
                                        disabled={isLoading}
                                    >
                                        View Cart
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
