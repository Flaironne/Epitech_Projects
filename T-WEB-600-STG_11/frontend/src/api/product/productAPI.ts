export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  accessory: boolean;
  createdAt: string;
  updatedAt: string;
  stripeId: string | null;
}
const apiURL = import.meta.env.VITE_API_URL;

export const search = async (query: string): Promise<Product[]> => {
  const response = await fetch(`${apiURL}/products/search/${query}`);
  if (!response.ok) {
    throw new Error("Failed to search products");
  }
  return response.json();
};

export const likeProduct = async (productId: number, token: string) => {
  const response = await fetch(`${apiURL}/products/${productId}/favorite`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to like product");
  }
};

export const unlikeProduct = async (productId: number, token: string) => {
  const response = await fetch(`${apiURL}/products/${productId}/favorite`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to unlike product");
  }
};

const fetchAllProducts = async (): Promise<Product[]> => {
  // console.log(`${apiURL}/products`);
  const response = await fetch(`${apiURL}/products`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
};

const fetchProductById = async (productId: number): Promise<Product> => {
  const response = await fetch(`${apiURL}/products/${productId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return response.json();
};

export { fetchAllProducts, fetchProductById };
