import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";

export default function useCart(auth) {
    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const addToCart = async (product) => {
        setIsLoading(true);

        try {
            if (auth.user) {
                // For authenticated users
                await new Promise((resolve, reject) => {
                    router.post(
                        route("cart.add", product.id),
                        {},
                        {
                            preserveScroll: true,
                            onSuccess: () => {
                                setNotification({
                                    type: "success",
                                    message: `${product.name} added to cart!`,
                                });
                                resolve();
                            },
                            onError: (errors) => {
                                setNotification({
                                    type: "error",
                                    message:
                                        errors.message ||
                                        "Failed to add to cart",
                                });
                                reject(errors);
                            },
                        }
                    );
                });
            } else {
                // For guest users
                const guestCart = JSON.parse(
                    localStorage.getItem("guest_cart") || "[]"
                );
                const existingItem = guestCart.find(
                    (item) => item.id === product.id
                );

                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    guestCart.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: 1,
                    });
                }

                localStorage.setItem("guest_cart", JSON.stringify(guestCart));
                setNotification({
                    type: "success",
                    message: `${product.name} added to guest cart!`,
                });
            }
        } catch (error) {
            setNotification({
                type: "error",
                message: error.message || "Failed to add to cart",
            });
            console.log("error: ", error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {}, [notification]);
    const clearNotification = () => {
        setNotification(null);
    };

    return {
        addToCart,
        notification,
        clearNotification,
        isLoading,
    };
}
