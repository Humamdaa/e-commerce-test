<?php

namespace App\Http\Controllers;

use App\Models\CartItems;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CartController extends Controller
{
    public function Index()
    {
        if (Auth::check()) {
            $cart = DB::table('carts')
                ->where('user_id', Auth::id())
                ->first();

            if ($cart) {
                $items = DB::table('cart_items')
                    ->join('products', 'cart_items.product_id', '=', 'products.id')
                    ->where('cart_items.cart_id', $cart->id)
                    ->select([
                        'products.id',
                        'products.name',
                        'products.price',
                        'products.image',
                        'cart_items.quantity'
                    ])
                    ->get();

                return response()->json($items);
            }
        } else {
            // For guest users
            $guestCart = json_decode(request()->cookie('guest_cart'), true) ?? [];
            $productIds = array_column($guestCart, 'id');

            if (!empty($productIds)) {
                $products = DB::table('products')
                    ->whereIn('id', $productIds)
                    ->select(['id', 'name', 'price', 'image'])
                    ->get()
                    ->keyBy('id');

                $items = array_map(function ($item) use ($products) {
                    return [
                        'id' => $item['id'],
                        'name' => $products[$item['id']]->name,
                        'price' => $products[$item['id']]->price,
                        'image' => $products[$item['id']]->image,
                        'quantity' => $item['quantity']
                    ];
                }, $guestCart);

                return back()->with(['cartItems' => $items]);
            }
        }

        return response()->json([]);
    }

    public function store(Request $request, Product $product)
    {
        $quantity = $request->input('quantity', 1);

        if (Auth::check()) {
            try {
                DB::transaction(function () use ($product, $quantity) {
                    $cartId = DB::table('carts')
                        ->insertOrIgnore(['user_id' => Auth::id()])
                        ?: DB::table('carts')->where('user_id', Auth::id())->value('id');

                    // Update or insert cart item
                    DB::table('cart_items')->updateOrInsert(
                        [
                            'cart_id' => $cartId,
                            'product_id' => $product->id
                        ],
                        [
                            'quantity' => DB::raw("COALESCE(quantity, 0) + $quantity"),
                            'updated_at' => now(),
                            'created_at' => DB::raw('IFNULL(created_at, NOW())')
                        ]
                    );
                });

                return back()->with(['success' => 'Product added to cart!']);
            } catch (\Exception $e) {
                return back()->with(['error' => 'Failed to add to cart: ' . $e->getMessage()]);
            }
        }
    }

    // app/Http/Controllers/CartController.php

    public function update(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $request->validate([
            'changes' => 'required|array',
            'changes.*.product_id' => 'required|exists:products,id',
            'changes.*.quantity' => 'required|integer|min:1',
            'changes.*.type' => 'required|in:update,remove'
        ]);

        $user_id = Auth::user()->id;
        $cart_id = DB::table('carts')->where('user_id', $user_id)->value('id');

        if (!$cart_id) {
            return response()->json(['error' => 'Cart not found'], 404);
        }

        DB::transaction(function () use ($request, $cart_id) {
            foreach ($request->changes as $change) {
                if ($change['type'] === 'update') {
                    DB::table('cart_items')->updateOrInsert(
                        [
                            'cart_id' => $cart_id,
                            'product_id' => $change['product_id']
                        ],
                        [
                            'quantity' => $change['quantity'],
                            'updated_at' => now()
                        ]
                    );
                } elseif ($change['type'] === 'remove') {
                    DB::table('cart_items')
                        ->where('cart_id', $cart_id)
                        ->where('product_id', $change['product_id'])
                        ->delete();
                }
            }
        });

        // Get updated cart items with product details
        $cartItems = DB::table('cart_items')
            ->join('products', 'cart_items.product_id', '=', 'products.id')
            ->where('cart_items.cart_id', $cart_id)
            ->select([
                'products.id',
                'products.name',
                'products.price',
                'products.image',
                'cart_items.quantity'
            ])
            ->get();

        return response()->json([
            'success' => true,
            'cartItems' => $cartItems
        ]);
    }

    public function destroy(Request $request, CartItems $item)
    {
        $item->delete();

        return back()->with(['cartItems' => $request->user()->cartItems()->with('product')->get()]);
    }
}
