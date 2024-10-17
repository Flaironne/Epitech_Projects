import React, { useState } from "react";
import ProductCard from "../components/ProductCard.tsx";
import { Product } from "../api/product/productAPI.ts";
import { useQuery } from "react-query";
import { Cart, getCart, validate } from "../api/carts/carts.ts";
import { useUser } from "../contexts/UserContext.tsx";
import { useSearchParams } from "react-router-dom";
import Loader from "../components/PuffLoader.tsx";

const ShoppingCart: React.FC = () => {
  const { user, token } = useUser();

  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data: cart,
    isLoading,
    error,
  } = useQuery<Cart>("cart_products", () => getCart(token), {
    enabled: !!token,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (searchParams?.get("s")) {
    validate(token).then(() => {});

    return (
      <div className="container mx-auto mt-10 bg-pink-01">
        <div className="sm:flex shadow-md my-10 flex flex-col justify-center align-center">
          <div>
            <div className="w-full sm:w-3/4 bg-pink-01 px-10 py-10">
              Your order has been placed successfully!
            </div>
            <div className="w-full sm:w-1/4 md:w-1/2 px-8 py-10">
              <button
                className="bg-brown-01 font-patrick font-semibold hover:bg-brown-02 py-3 text-sm text-brown-02 hover:text-brown-01 uppercase w-full"
                onClick={() => {
                  location.href = "/";
                }}
              >
                Go to home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 bg-pink-01">
      <div className="sm:flex shadow-md my-10">
        <div className="w-full sm:w-3/4 bg-pink-01 px-10 py-10">
          <div className="flex justify-between border-b pb-8">
            <h1 className="font-semibold font-patrick text-2xl">
              Shopping Cart
            </h1>
            <h2 className="font-semibold font-patrick text-2xl">
              {cart.products.length} Items
            </h2>
          </div>
          {cart.products.map((item: Product) => (
            <ProductCard
              key={item.id}
              productType={item.name}
              product={item}
              cart={true}
            />
          ))}
        </div>
        <div id="summary" className="w-full sm:w-1/4 md:w-1/2 px-8 py-10">
          <h1 className="font-patrick font-semibold text-2xl border-b pb-8">
            Order Summary
          </h1>
          <div className="mt-5">
            <label className="font-patrick font-medium inline-block mb-3 text-sm uppercase">
              Shipping
            </label>
            <select
              className="font-patrick block p-2 text-gray-600 w-full text-sm"
              disabled
            >
              <option selected disabled>
                Standard shipping - 0.00 cents FREEE
              </option>
            </select>
          </div>
          <div className="border-t mt-8">
            <div className="flex font-semibold font-patrick justify-between py-6 text-sm uppercase">
              <span>Total cost</span>
              <span>
                {cart.products.reduce((acc, item) => acc + item.price * 1, 0)}{" "}
                cents
              </span>
            </div>
            <button
              className={
                "bg-brown-01 font-patrick font-semibold hover:bg-brown-02 py-3 text-sm text-brown-02 hover:text-brown-01 uppercase w-full" +
                (cart.products.length === 0 || !cart.link
                  ? " cursor-not-allowed"
                  : "")
              }
              onClick={() => {
                location.href = cart.link;
              }}
              disabled={cart.products.length === 0 || !cart.link}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
