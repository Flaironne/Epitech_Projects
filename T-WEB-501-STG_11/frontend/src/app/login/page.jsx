"use client";
import "JQ/styles/tailwind.css";
import Layout from "JQ/components/Layout";
import { useState } from "react";
import useAuth from "JQ/hooks/auth";
import Loading from "JQ/components/Loading";
import Error from "JQ/components/Error";
import Title from "JQ/components/Title"

export default function Home() {
  const { login, isLoading, error } = useAuth({ middleware: "guest" });
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChanges = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(credentials);
  };

  return (
    <Layout>
      <Title content="Welcome Back !"/>
      <div className="account__details">
        <form className="form__generic" onSubmit={handleSubmit} method="post">
          <div className="form__group">
            {error ? <Error message={error} /> : null}
            Email
            <input
              className="form__input"
              type="email"
              placeholder="Enter your email"
              name="email"
              onChange={(e) => handleChanges(e)}
              required
            />
          </div>
          <div className="form__group">
            Password
            <input
              className="form__input"
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={(e) => handleChanges(e)}
              required
            />
          </div>
          {isLoading ? (
            <Loading />
          ) : (
            <div className="form__inline">
              <div className="form__group">
                <button type="submit">Sign In</button>
              </div>
              <div className="form__group">
                <button
                  type="button"
                  onClick={() => (window.location.href = "/register")}
                >
                  Register
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </Layout>
  );
}
