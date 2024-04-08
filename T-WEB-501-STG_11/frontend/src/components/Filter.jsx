import "JQ/styles/components/Filter.css";
import { useEffect, useState } from "react";
import Select from "JQ/components/Form/Select";
import Form from "JQ/components/Form/Form";
import Loading from "JQ/components/Loading";
import SearchIcon from "./Icons/SearchIcon";
import { API_URL } from "JQ/services/constants";

export default function Filter({ filters }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    regions: [],
    workplaces: [],
    types: [],
  });

  const retrieve = async () => {
    const data = await fetch(API_URL + "/filters");
    let dataJson = await data.json();
    setData(dataJson);
    setLoading(false);
  };

  useEffect(() => {
    retrieve();
  }, []);

  return (
    <Form method="GET" onSubmit={() => {}} className="filter__form">
      <div className="form__group">
        <input
          type="text"
          name="search"
          id="search"
          defaultValue={filters.search}
          className="form__input"
          placeholder="Search by job titlte, company name or description..."
        />
        <button type="submit" className="search">
          <span>Search</span>
          <SearchIcon />
        </button>
      </div>
      {loading ? (
        <Loading style={{ marginTop: "1.5rem" }} />
      ) : (
        <div className="filters">
          <Select
            name="region_id"
            options={data.regions}
            defaultValue={filters.region_id}
          />
          <Select
            name="workplace_id"
            options={data.workplaces}
            defaultValue={filters.workplace_id}
          />
          <Select
            name="type_id"
            options={data.types}
            defaultValue={filters.type_id}
          />
        </div>
      )}
    </Form>
  );
}
