import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function ProductCreate({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        price: "",
        description: "",
        image: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("products.store"));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Create Product
                </h2>
            }
        >
            <Head title="Create Product" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="name"
                                    >
                                        Product Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs italic">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="price"
                                    >
                                        Price
                                    </label>
                                    <input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={data.price}
                                        onChange={(e) =>
                                            setData("price", e.target.value)
                                        }
                                    />
                                    {errors.price && (
                                        <p className="text-red-500 text-xs italic">
                                            {errors.price}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="description"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-xs italic">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="image"
                                    >
                                        Image URL
                                    </label>
                                    <input
                                        id="image"
                                        type="text"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={data.image}
                                        onChange={(e) =>
                                            setData("image", e.target.value)
                                        }
                                    />
                                    {errors.image && (
                                        <p className="text-red-500 text-xs italic">
                                            {errors.image}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? "Creating..."
                                            : "Create Product"}
                                    </button>
                                    <Link
                                        href={route("products.index")}
                                        className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                                    >
                                        Back to Products
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
