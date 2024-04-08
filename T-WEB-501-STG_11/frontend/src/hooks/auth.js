import { API_URL, headers } from "JQ/services/constants";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function useAuth(
  { middleware, role } = { middleware: null, role: null }
) {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("user") || false;
    if (isAuthenticated) setUser(JSON.parse(isAuthenticated));
    if (middleware === "guest" && isAuthenticated) {
      router.push("/");
    } else if (middleware === "private" && !isAuthenticated) {
      router.push("/login");
    } else if (middleware === "private" && isAuthenticated) {
      const isAdminUser = JSON.parse(isAuthenticated).is_admin || false;
      if (role === "admin" && !isAdminUser) {
        router.push("/");
      }
    }
    checkAuthAndRedirect();
    setIsLoading(false);
  }, []);

  function checkAuthAndRedirect() {
    let token = localStorage.getItem("token");
    fetch(API_URL + "/me", {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setIsLogged(true);
          return res.json();
        }
        setIsLogged(false);
        setIsAdmin(false);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        return null;
      })
      .then((data) => {
        if (data) {
          setIsAdmin(data.user.is_admin);
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      });
  }

  async function login(credentials) {
    setIsLoading(true);
    const response = await fetch(API_URL + "/auth/login", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (data.user) {
      setError(false);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setIsLogged(true);
      if (data.user.is_admin === true) {
        setIsAdmin(true);
        router.push("/admin");
      } else {
        router.push("/");
      }
    } else if (data.success === false) {
      setError(data.message);
      setIsLoading(false);
    }
  }

  async function register(credentials) {
    setIsLoading(true);
    const response = await fetch(API_URL + "/auth/register", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    console.log(data);
    if (data.success === true) {
      setError(false);
      router.push("/login");
    } else if (data.success === false) {
      setError(data.data);
      setIsLoading(false);
    }
  }

  async function logout() {
    let token = localStorage.getItem("token");
    await fetch(API_URL + "/auth/logout", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ token }),
    });
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsLogged(false);
    location.href = "/";
  }

  async function updateAccount(data) {
    setIsLoading(true);
    return fetch(API_URL + "/account", {
      method: "PUT",
      headers: {
        ...headers,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data)
        if (data.success === false) {
          setError(data.data);
          setIsLoading(false);
          return false;
        } else {
          setError(false);
          setUser(data.data);
          localStorage.setItem("user", JSON.stringify(data.data));
          setIsLoading(false);
        }
        return true;
      });
  }

  return {
    isLogged,
    isLoading,
    user,
    isAdmin,
    middleware,
    error,
    login,
    updateAccount,
    register,
    logout,
  };
}
