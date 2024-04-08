import { Switch, Input, Spinner } from "@nextui-org/react";
import ModalLayout from "./ModalLayout";
import { useEffect, useState } from "react";
import { API_URL, headers } from "JQ/services/constants";
import Error from "../Error";
import Swal from "sweetalert2";

export default function UserModal({ action, targetId, ...props }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    is_admin: targetId === null ? false : null,
  });

  function handleChange(e) {
    setData({
      ...data,
      [e.target.name]: e.target.value || e.target.checked,
    });
  }

  useEffect(() => {
    if (targetId === null) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/users/${targetId}`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setUser(res);
        setData({
          firstname: res.firstname,
          lastname: res.lastname,
          email: res.email,
          phone: res.phone,
          is_admin: res.is_admin,
        });
        setLoading(false);
      });
  }, []);

  function onSubmit() {
    setSubmitting(true);

    let endpoint = targetId === null ? "/users" : `/users/${targetId}`;
    let method = targetId === null ? "POST" : "PUT";

    fetch(API_URL + endpoint, {
      method: method,
      headers: {
        ...headers,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.success === false || !res) {
          setError(res.data);
          setSubmitting(false);
        } else {
          setError(null);
          Swal.fire({
            title: targetId === null ? "Added!" : "Updated!",
            text:
              targetId === null
                ? "User has been added."
                : "User has been updated.",
            icon: "success",
            preConfirm: () => {
              location.reload();
            },
          });
        }
      });
  }

  return (
    <ModalLayout {...props} onSubmit={onSubmit} submitting={submitting}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="flex gap-2">
            <div className="flex flex-col flex-1">
              <Input
                type="text"
                name="firstname"
                label="Firstname"
                variant="faded"
                placeholder="Enter the firstname"
                onChange={handleChange}
                defaultValue={user?.firstname || data.firstname}
              />
              {error?.firstname && <Error message={error?.firstname} />}
            </div>
            <div className="flex flex-col flex-1">
              <Input
                type="text"
                name="lastname"
                label="Lastname"
                variant="faded"
                placeholder="Enter the lastname"
                onChange={handleChange}
                defaultValue={user?.lastname || data.lastname}
              />
              {error?.lastname && <Error message={error?.lastname} />}
            </div>
          </div>
          <div className="flex flex-col">
            <Input
              type="email"
              label="Email"
              name="email"
              variant="faded"
              placeholder="Enter the email"
              onChange={handleChange}
              defaultValue={user?.email || data.email}
            />
            {error?.email && <Error message={error?.email} />}
          </div>
          <div className="flex flex-col">
            <Input
              type="text"
              maxLength={10}
              name="phone"
              label="Phone"
              variant="faded"
              placeholder="Enter the phone"
              onChange={handleChange}
              defaultValue={user?.phone || data.phone}
            />
            {error?.phone && <Error message={error?.phone} />}
          </div>
          <div className="flex flex-col">
            <Input
              type="password"
              name="password"
              label="Password"
              variant="faded"
              placeholder="Enter the password"
              onChange={handleChange}
            />
            {error?.password && <Error message={error?.password} />}
          </div>
          <Switch
            aria-label="Is admin"
            name="is_admin"
            defaultSelected={user?.is_admin || data.is_admin}
            onChange={handleChange}
          >
            Is admin
          </Switch>
          {error?.is_admin && <Error message={error?.is_admin} />}
        </>
      )}
    </ModalLayout>
  );
}
