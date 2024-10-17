export const fetchAllUsers = async (token: string) => {
  const apiURL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiURL}/admin/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to get users");
  }
  return response.json();
};

export const deleteProduct = async (productId: string, token: string) => {
  const apiURL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiURL}/products/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete product");
  }
  return response.json();
};

export const addProduct = async (
  product: {
    name: string;
    description: string;
    price: number;
    image?: string;
  },
  token: string
) => {
  const apiURL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiURL}/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    throw new Error("Failed to add product");
  }
  return response.json();
};

export const updateProduct = async (
  product: {
    name: string;
    description: string;
    price: number;
    image?: string;
  },
  productId: string,
  token: string
) => {
  const apiURL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiURL}/admin/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    throw new Error("Failed to add product");
  }
  return response.json();
};

export const deleteUser = async (userId: string, token: string) => {
  const apiURL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiURL}/admin/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
  return response.json();
};

export const updateUser = async (
  user: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
  },
  userId: string,
  token: string
) => {
  const apiURL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiURL}/admin/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error("Failed to update user");
  }
  return response.json();
};

export const addUser = async (
  user: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    is_admin: boolean;
  },
  token: string
) => {
  const apiURL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiURL}/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error("Failed to add user");
  }
  return response.json();
};
