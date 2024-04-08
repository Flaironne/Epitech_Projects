import { useEffect, useState } from "react";
import ModalLayout from "./ModalLayout";
import { API_URL, headers } from "JQ/services/constants";
import { Input, Spinner } from "@nextui-org/react";
import Error from "../Error";
import Swal from "sweetalert2";

export default function DefaultModal({ name, targetId, action, ...props }) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState({
    label: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value || e.target.checked,
    });
  };

  useEffect(() => {
    if (targetId === null) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/${name}/${targetId}`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setItem(res);
        setLoading(false);
      });
  }, [name]);

  function onSubmit() {
    setSubmitting(true);

    let endpoint = targetId === null ? `/${name}` : `/${name}/${targetId}`;
    let method = targetId === null ? "POST" : "PUT";

    for (let key in data) {
      if (data[key] === "") {
        delete data[key];
      }
    }

    fetch(`${API_URL}${endpoint}`, {
      method: method,
      headers: {
        ...headers,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.success === false || !res) {
          setError(res.data);
          setSubmitting(false);
        } else {
          setError(null);
          Swal.fire({
            title: targetId === null ? "Added!" : "Updated!",
            text:
              targetId === null
                ? `The ${name} has been added.`
                : `The ${name} has been updated.`,
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
        <div className="flex flex-col">
          <Input
            type="text"
            label="Label"
            name="label"
            onChange={handleChange}
            variant="faded"
            placeholder="Enter the label"
            defaultValue={item?.label}
          />
          {error?.label && <Error message={error.label} />}
        </div>
      )}
    </ModalLayout>
  );
}
