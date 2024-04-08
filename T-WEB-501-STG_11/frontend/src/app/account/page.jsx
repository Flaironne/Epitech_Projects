"use client";
import Select from "JQ/components/Form/Select";
import Layout from "JQ/components/Layout";
import Loading from "JQ/components/Loading";
import useAuth from "JQ/hooks/auth";
import { API_URL } from "JQ/services/constants";
import Error from "JQ/components/Error";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Title from "JQ/components/Title";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const { user, isLoading, updateAccount, error } = useAuth({
    middleware: "private",
  });
  const [data, setData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
    new_password: "",
    new_password_confirmation: "",
    region_id: null,
  });

  useEffect(() => {
    fetch(API_URL + "/filters")
      .then((res) => res.json())
      .then((data) => {
        setRegions(data.regions);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let key in data) {
      if (data[key] === "" || data[key] === null) {
        delete data[key];
      }
    }
    console.log(data, Object.keys(data).length === 0);
    if (Object.keys(data).length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No changes detected",
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await updateAccount(data);
          if (res) {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Account updated successfully, the page will reload.",
              preConfirm: () => {
                location.reload();
              },
            });
          }
        }
      });
    }
  };

  return (
    <Layout>
      <>
        <Title content="Account" />
        <form className="form__generic" onSubmit={handleSubmit}>
          <div className="form__group">
            <label htmlFor="email">Email</label>
            <input
              name="email"
              className="form__input"
              type="email"
              defaultValue={user?.email}
              onChange={handleChange}
            />
            {error.email ? <Error message={error.email} /> : null}
          </div>
          <div className="form__inline">
            <div className="form__group">
              <label htmlFor="firstname">Firstname</label>
              <input
                name="firstname"
                className="form__input"
                type="text"
                defaultValue={user?.firstname}
                onChange={handleChange}
              />
              {error.firstname ? <Error message={error.firstname} /> : null}
            </div>
            <div className="form__group">
              <label htmlFor="lastname">Lastname</label>
              <input
                name="lastname"
                className="form__input"
                type="text"
                defaultValue={user?.lastname}
                onChange={handleChange}
              />
              {error.lastname ? <Error message={error.lastname} /> : null}
            </div>
          </div>
          <div className="form__group">
            <label htmlFor="phone">Phone</label>
            <input
              name="phone"
              className="form__input"
              type="text"
              defaultValue={user?.phone}
              onChange={handleChange}
            />
            {error.phone ? <Error message={error.phone} /> : null}
          </div>
          <div className="form__group">
            <label htmlFor="region_id">Preferred region</label>
            {loading ? (
              <Loading />
            ) : (
              <Select
                name="region_id"
                options={regions}
                defaultValue={user?.region?.id}
                onChange={handleChange}
              />
            )}
          </div>
          <div className="form__group">
            <label htmlFor="password">Current password</label>
            <input
              name="password"
              className="form__input"
              type="password"
              placeholder="*********"
              onChange={handleChange}
            />
            {error.password ? <Error message={error.password} /> : null}
          </div>
          <div className="form__group">
            <label htmlFor="new_password">New password</label>
            <input
              name="new_password"
              className="form__input"
              type="password"
              placeholder="*********"
              onChange={handleChange}
            />
          </div>
          <div className="form__group">
            <label htmlFor="new_password_confirmation">
              Confirm new password
            </label>
            <input
              name="new_password_confirmation"
              className="form__input"
              type="password"
              placeholder="*********"
              onChange={handleChange}
            />
            {error.new_password ? <Error message={error.new_password} /> : null}
          </div>
          <div className="form__group">
            {isLoading ? (
              <Loading
                style={{
                  marginTop: "1rem",
                }}
              />
            ) : (
              <button type="submit">Update</button>
            )}
          </div>
        </form>
      </>
    </Layout>
  );
}
