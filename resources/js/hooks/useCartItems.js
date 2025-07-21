// hooks/useCartItems.js
import { useState } from "react";
import { router } from "@inertiajs/react";
import axios from "axios";

export function useCartItems(auth) {
    const [isLoading, setIsLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [pendingChanges, setPendingChanges] = useState([]);

    const fetchCartItems = async () => {
        setIsLoading(true);
        try {
            if (auth.user) {
                const response = await axios.get(route("cart.items"));
                setCartItems(response.data);
            } else {
                const guestCart = JSON.parse(
                    localStorage.getItem("guest_cart") || "[]"
                );
                setCartItems(guestCart);
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const addPendingChange = (productId, type, quantity = null) => {
        setPendingChanges((prev) => {
            // Remove any existing changes for this product
            const otherChanges = prev.filter((c) => c.product_id !== productId);

            if (type === "remove") {
                return [...otherChanges, { product_id: productId, type }];
            }

            return [
                ...otherChanges,
                {
                    product_id: productId,
                    type,
                    quantity,
                },
            ];
        });
    };

    const saveCartChanges = async () => {
        if (pendingChanges.length === 0) return;

        setIsLoading(true);
        try {
            if (auth.user) {
                const response = await axios.post(route("cart.update"), {
                    changes: pendingChanges,
                });
                setCartItems(response.data.cartItems);
            } else {
                // Handle guest cart updates
                let updatedItems = [...cartItems];

                pendingChanges.forEach((change) => {
                    if (change.type === "remove") {
                        updatedItems = updatedItems.filter(
                            (item) => item.id !== change.product_id
                        );
                    } else {
                        const itemIndex = updatedItems.findIndex(
                            (item) => item.id === change.product_id
                        );
                        if (itemIndex >= 0) {
                            updatedItems[itemIndex] = {
                                ...updatedItems[itemIndex],
                                quantity: change.quantity,
                            };
                        }
                    }
                });

                setCartItems(updatedItems);
                localStorage.setItem(
                    "guest_cart",
                    JSON.stringify(updatedItems)
                );
            }

            setPendingChanges([]);
        } catch (error) {
            console.error("Error saving cart changes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateCartItem = (productId, quantity) => {
        addPendingChange(productId, "update", quantity);
    };

    const removeCartItem = (productId) => {
        addPendingChange(productId, "remove");
    };

    // Apply pending changes to create display items
    const displayItems = cartItems.reduce((acc, item) => {
        const changes = pendingChanges.filter((c) => c.product_id === item.id);
        const removeChange = changes.find((c) => c.type === "remove");
        if (removeChange) return acc;

        const updateChange = changes.find((c) => c.type === "update");
        if (updateChange) {
            return [...acc, { ...item, quantity: updateChange.quantity }];
        }

        return [...acc, item];
    }, []);

    return {
        cartItems: displayItems,
        pendingChanges,
        fetchCartItems,
        updateCartItem,
        removeCartItem,
        saveCartChanges,
        isLoading,
    };
}
