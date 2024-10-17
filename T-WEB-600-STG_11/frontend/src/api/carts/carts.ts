import { Product } from "../product/productAPI.ts";

export interface Cart {
  link: string;
  products: Product[];
}

const apiURL = import.meta.env.VITE_API_URL;

export const getCart = async (token: string): Promise<Cart> => {
  const response = await fetch(`${apiURL}/carts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to get cart products");
  }
  return response.json();
};

export const addProduct = async (
  token: string,
  productId: number
): Promise<void> => {
  const response = await fetch(`${apiURL}/carts/${productId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to add product to cart");
  }
};

export const removeProduct = async (
  token: string,
  productId: number
): Promise<void> => {
  const response = await fetch(`${apiURL}/carts/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to remove product from cart");
  }
};

export const validate = async (token: string): Promise<boolean> => {
  const response = await fetch(`${apiURL}/carts/validate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to validate cart");
  }
  return await response.json();
};
