"use client";
import Error from "JQ/components/Error";
import "JQ/styles/tailwind.css";
import Layout from "JQ/components/Layout";
import Loading from "JQ/components/Loading";
import useAuth from "JQ/hooks/auth";
import { useState } from "react";
import Title from "JQ/components/Title"

export default function Home() {
  const { register, error } = useAuth({ middleware: "guest" });
  const [registerAttempt, setRegisterAttempt] = useState(false);
  const [credentials, setCredentials] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const handleChanges = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    setRegisterAttempt(true);
    e.preventDefault();
    await register(credentials);
    setRegisterAttempt(false);
  };

  return (
    <Layout>
      <Title content="Welcome !"/>
      <div className="account__details">
        <form className="form__generic" onSubmit={handleSubmit} method="post">
          <div className="form__inline">
            <div className="form__group">
              First Name
              <input
                className="form__input"
                type="text"
                onChange={(e) => handleChanges(e)}
                placeholder="Enter your first name"
                name="firstname"
                required
              />
            </div>
            <div className="form__group">
              Last Name
              <input
                className="form__input"
                type="text"
                placeholder="Enter your last name"
                name="lastname"
                onChange={(e) => handleChanges(e)}
                required
              />
            </div>
          </div>
          <div className="form__group">
            Email
            <input
              className="form__input"
              type="text"
              placeholder="Enter your email"
              name="email"
              onChange={(e) => handleChanges(e)}
              required
            />
            {error.email ? <Error message={error.email} /> : null}
          </div>
          <div className="form__group">
            Phone Number
            <input
              className="form__input"
              type="text"
              name="phone"
              placeholder="Enter your phone number"
              onChange={(e) => handleChanges(e)}
              required
            />
            {error.phone ? <Error message={error.phone} /> : null}
          </div>
          <div className="form__group">
            Password
            <input
              className="form__input"
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={(e) => handleChanges(e)}
              required
            />
          </div>
          <div className="form__group">
            Confirm Password
            <input
              className="form__input"
              type="password"
              name="password_confirmation"
              placeholder="Confirm your password"
              onChange={(e) => handleChanges(e)}
              required
            />
            {error.password ? <Error message={error.password} /> : null}
          </div>
          <div className="form__group">
            {registerAttempt ? (
              <Loading />
            ) : (
              <button type="submit">Sign Up</button>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
}
