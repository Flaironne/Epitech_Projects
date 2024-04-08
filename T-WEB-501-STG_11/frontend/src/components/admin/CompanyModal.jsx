import { useEffect, useState } from "react";
import ModalLayout from "./ModalLayout";
import { API_URL, headers } from "JQ/services/constants";
import { Input, Spinner } from "@nextui-org/react";
import Swal from "sweetalert2";
import Error from "../Error";

export default function CompanyModal({ action, targetId, ...props }) {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    label: "",
    stars: 0,
  });
  const [submitting, setSubmitting] = useState(false);

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

    fetch(`${API_URL}/companies/${targetId}`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setCompany(res);
        setLoading(false);
      });
  }, []);

  function onSubmit() {
    setSubmitting(true);

    let endpoint = targetId === null ? "/companies" : `/companies/${targetId}`;
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
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res)
        if (res.success === false || !res) {
          setError(res.data);
          setSubmitting(false);
        } else {
          setError(null);
          Swal.fire({
            title: targetId === null ? "Added!" : "Updated!",
            text:
              targetId === null
                ? "Job has been added."
                : "Job has been updated.",
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
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              name="label"
              label="Label"
              variant="faded"
              placeholder="Enter the label"
              defaultValue={company?.label || data.label}
              onChange={handleChange}
            />
            {error?.label && <Error message={error?.label} />}
          </div>
          <div className="flex flex-col gap-2">
            <Input
              type="number"
              name="stars"
              label="Stars"
              variant="faded"
              placeholder="Number of stars (1-5)"
              defaultValue={company?.stars || data.stars}
              onChange={handleChange}
            />
            {error?.stars && <Error message={error?.stars} />}
          </div>
        </>
      )}
    </ModalLayout>
  );
}
