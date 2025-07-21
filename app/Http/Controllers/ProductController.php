<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        return Inertia::render('Product/Index', [
            'products' => $products,
        ]);
    }

    public function create()
    {
        return Inertia::render('Product/CreateProduct');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'required|string',
            'image' => 'required|string',
        ]);

        Product::create($request->all());

        return redirect()->route('products.index');
    }

    public function show(Product $product)
    {
        return Inertia::render('Product/Show', [
            'product' => $product,
            'relatedProducts' => Product::where('id', '!=', $product->id)
                ->inRandomOrder()
                ->limit(4)
                ->get()
        ]);
    }
}
