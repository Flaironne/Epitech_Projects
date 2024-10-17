<?php

namespace App;

use App\Entity\Order;
use App\Entity\Product;
use Stripe\Product as StripeProduct;
use Stripe\Stripe;

class StripeClient
{
    public function __construct(
        readonly private string $clientSecret,
        readonly private string $cancelUrl = '',
        readonly private string $successUrl = '',
    ) {
        Stripe::setApiKey($this->clientSecret);
        Stripe::setApiVersion('2020-08-27');
    }

    public function createProduct(Product $product): Product
    {
        $resource = StripeProduct::create([
            'active' => true,
            'name' => $product->getName(),
            'description' => $product->getDescription(),
            'default_price_data[currency]' => 'eur',
            'default_price_data[unit_amount]' => $product->getPrice() * 100,
        ]);

        $product->setStripeId($resource->id);

        return $product;
    }

    public function generateLink(Order $order): string
    {
        $products = $order->getProducts();

        if ($products->isEmpty()) {
            return '';
        }

        $session = \Stripe\Checkout\Session::create([
            'payment_method_types' => ['card'],
            'line_items' => $products->map(function (Product $product) {
                return [
                    'price_data' => [
                        'currency' => 'eur',
                        'product_data' => [
                            'name' => $product->getName(),
                            'description' => $product->getDescription(),
                        ],
                        'unit_amount' => $product->getPrice(),
                    ],
                    'quantity' => 1,
                ];
            })->toArray(),
            'mode' => 'payment',
            'success_url' => $this->successUrl,
            'cancel_url' => $this->cancelUrl,
        ]);

        return $session->url;
    }

    public function updateProduct(Product $product)
    {
        StripeProduct::update($product->getStripeId(), [
            'name' => $product->getName(),
            'description' => $product->getDescription(),
        ]);
    }

    public function deleteProduct(Product $product)
    {
        StripeProduct::update($product->getStripeId(), [
            'active' => false,
        ]);
    }

    public function startPayment(Order $order)
    {
    }
}
