import { Product } from "../product/productAPI.ts";

export interface User {
  id: number;
  email: string;
  userIdentifier: string;
  roles: string[];
  password: string;
  firstname: string;
  lastname: string;
  createdAt: string; // Assuming createdAt and updatedAt are strings representing dates
  updatedAt: string;
  is_admin: boolean;
  orders: any[]; // Assuming orders is an array of any data type
  favorites: Product[]; // Assuming favorites is an array of Product
}

export interface UserAuth {
  user: User;
  token: string;
}

const fetchRegister = async (
  email: string,
  password: string,
  firstname: string,
  lastname: string
): Promise<UserAuth> => {
  const apiURL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiURL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      firstname,
      lastname,
      is_admin: false,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to register");
  }
  return response.json();
};

const fetchLogin = async (
  email: string,
  password: string
): Promise<UserAuth> => {
  const apiURL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiURL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error("Failed to login");
  }
  return response.json();
};

const fetchMe = async (apiToken: string): Promise<UserAuth> => {
  const apiURL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiURL}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiToken,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to login");
  }
  return response.json();
};

const fetchModifyUsers = async (
  email: string,
  password: string,
  firstname: string,
  lastname: string,
  token: string
): Promise<UserAuth> => {
  const apiURL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiURL}/users`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      email,
      password,
      firstname,
      lastname,
      is_admin: false,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to modify user");
  }
  return response.json();
};

const fetchMeOrders = async (apiToken: string): Promise<any[]> => {
  const apiURL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiURL}/users/orders`);
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
};

export { fetchRegister, fetchLogin, fetchMe, fetchModifyUsers, fetchMeOrders };
