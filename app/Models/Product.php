<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'description',
        'image',
    ];

    public function sellers()
    {
        return $this->belongsToMany(User::class, 'sellers', 'product_id', 'user_id');
    }

    public function buyers()
    {
        return $this->belongsToMany(User::class, 'buyers', 'product_id', 'user_id');
    }

    public function carts()
    {
        return $this->belongsToMany(Cart::class, 'cart_quantity')
            ->withPivot('quantity')
            ->withTimestamps();
    }
}
