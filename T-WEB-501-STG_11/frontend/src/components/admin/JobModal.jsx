import {
  Textarea,
  Input,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import ModalLayout from "./ModalLayout";
import { useEffect, useState } from "react";
import { API_URL, headers } from "JQ/services/constants";
import Error from "../Error";
import Swal from "sweetalert2";

export default function JobModal({ action, targetId, ...props }) {
  const [loading, setLoading] = useState(true);
  const [regions, setRegions] = useState([]);
  const [types, setTypes] = useState([]);
  const [workplaces, setWorkplaces] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [job, setJob] = useState(null);
  const [data, setData] = useState({
    label: "",
    description: "",
    duration: "",
    salary: "",
    type_id: "",
    region_id: "",
    workplace_id: "",
    company_id: "",
  });

  function handleChange(e) {
    setData({
      ...data,
      [e.target.name]: e.target.value || e.target.checked,
    });
  }

  useEffect(() => {
    fetch(`${API_URL}/filters`, {
      method: "GET",
      headers: headers,
    })
      .then((res) => res.json())
      .then((res) => {
        setRegions(res.regions);
        setTypes(res.types);
        setWorkplaces(res.workplaces);
      });

    fetch(`${API_URL}/companies`, {
      method: "GET",
      headers: headers,
    })
      .then((res) => res.json())
      .then((res) => {
        setCompanies(res);
      });

    if (targetId === null) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/jobs/${targetId}`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setJob(res);
        setLoading(false);
      });
  }, [targetId]);

  function onSubmit() {
    setSubmitting(true);

    let endpoint = targetId === null ? "/jobs" : `/jobs/${targetId}`;
    let method = targetId === null ? "POST" : "PUT";

    for (let key in data) {
      if (data[key] === "") {
        delete data[key];
      }
    }

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
          <div className="flex flex-col">
            <Input
              type="text"
              label="Label"
              name="label"
              variant="faded"
              placeholder="Enter the label"
              defaultValue={job?.label || data.label}
              onChange={handleChange}
            />
            {error?.label && <Error message={error?.label} />}
          </div>
          <div className="flex flex-col">
            <Textarea
              label="Description"
              name="description"
              variant="faded"
              placeholder="Enter the description"
              defaultValue={job?.description || data.description}
              onChange={handleChange}
            />
            {error?.description && <Error message={error?.description} />}
          </div>
          <div className="flex gap-2 w-full">
            <div className="flex flex-col flex-1">
              <Input
                type="text"
                label="Duration"
                name="duration"
                variant="faded"
                placeholder="Enter the duration"
                defaultValue={job?.duration || data.duration}
                onChange={handleChange}
              />
              {error?.duration && <Error message={error?.duration} />}
            </div>
            <div className="flex flex-col flex-1">
              <Input
                type="text"
                label="Salary (in € per month)"
                variant="faded"
                name="salary"
                placeholder="Enter the salary"
                defaultValue={job?.salary || data.salary}
                onChange={handleChange}
              />
              {error?.salary && <Error message={error?.salary} />}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col flex-1">
              <Select
                items={types}
                label="Type"
                name="type_id"
                defaultSelectedKeys={
                  job?.type.id
                    ? [`${job?.type.id}`]
                    : data.type_id
                    ? [`${data.type_id}`]
                    : null
                }
                onChange={handleChange}
              >
                {(type) => (
                  <SelectItem textValue={type.label} key={type.id}>
                    {type.label}
                  </SelectItem>
                )}
              </Select>
              {error?.type_id && <Error message={error?.type_id} />}
            </div>
            <div className="flex flex-col flex-1">
              <Select
                items={workplaces}
                name="workplace_id"
                label="Workplace"
                defaultSelectedKeys={
                  job?.workplace.id
                    ? [`${job?.workplace.id}`]
                    : data.workplace_id
                    ? [`${data.workplace_id}`]
                    : null
                }
                onChange={handleChange}
              >
                {(workplace) => (
                  <SelectItem textValue={workplace.label} key={workplace.id}>
                    {workplace.label}
                  </SelectItem>
                )}
              </Select>
              {error?.workplace_id && <Error message={error?.workplace_id} />}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col flex-1">
              <Select
                items={regions}
                name="region_id"
                label="Workplace"
                defaultSelectedKeys={
                  job?.region.id
                    ? [`${job?.region.id}`]
                    : data.region_id
                    ? [`${data.region_id}`]
                    : null
                }
                onChange={handleChange}
              >
                {(region) => (
                  <SelectItem textValue={region.label} key={region.id}>
                    {region.label}
                  </SelectItem>
                )}
              </Select>
              {error?.region_id && <Error message={error?.region_id} />}
            </div>
            <div className="flex flex-col flex-1">
              <Select
                items={companies}
                name="company_id"
                label="Companies"
                defaultSelectedKeys={
                  job?.company.id
                    ? [`${job?.company.id}`]
                    : data.company_id
                    ? [`${data.company_id}`]
                    : null
                }
                onChange={handleChange}
              >
                {(company) => (
                  <SelectItem textValue={company.label} key={company.id}>
                    {company.label}
                  </SelectItem>
                )}
              </Select>
              {error?.company_id && <Error message={error?.company_id} />}
            </div>
          </div>
        </>
      )}
    </ModalLayout>
  );
}
