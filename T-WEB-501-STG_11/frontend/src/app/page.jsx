"use client";

import Layout from "JQ/components/Layout";
import Job from "JQ/components/Job";
import { useEffect, useState } from "react";
import Loading from "JQ/components/Loading";
import JobDetails from "JQ/components/JobDetails";
import SkeletonJob from "JQ/components/SkeletonJob";
import SkeletonJobDetails from "JQ/components/SkeletonJobDetails";
import Filter from "JQ/components/Filter";
import { API_URL } from "JQ/services/constants";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [index, setIndex] = useState(0);
  const [filtersValues, setFiltersValues] = useState({
    search: null,
    region_id: null,
    workplace_id: null,
    type_id: null,
  });

  const retrieveFilters = () => {
    let params = new URLSearchParams(window.location.search);
    let filters = {
      search: params.get("search") === "" ? null : params.get("search"),
      region_id:
        params.get("region_id") === "" ? null : params.get("region_id"),
      workplace_id:
        params.get("workplace_id") === "" ? null : params.get("workplace_id"),
      type_id: params.get("type_id") === "" ? null : params.get("type_id"),
    };
    let hasFilters = false;
    for (let key in filters) {
      if (filters[key] !== null) {
        hasFilters = true;
        break;
      }
    }
    return [hasFilters, filters];
  };

  const loadJobs = async (page) => {
    let [hasFilters, filters] = retrieveFilters();
    if (hasFilters) {
      setFiltersValues(filters);
      let params = "";
      for (const key in filters) {
        if (filters[key] !== null) {
          params += "&" + key + "=" + filters[key];
        }
      }
      const res = await fetch(API_URL + "/search?" + params);
      const data = await res.json();
      setJobs(data);
    } else {
      const res = await fetch(API_URL + "/jobs?page=" + page);
      const data = await res.json();
      if (data && data.length > 0) {
        setJobs([...jobs, ...data]);
      }
    }
    setPage(page + 1);
  };

  const infiniteScroll = () => {
    setLoadingMore(true);
    setTimeout(() => {
      loadJobs(page);
      setLoadingMore(false);
    }, 800);
  };

  useEffect(() => {
    loadJobs(page);
    setLoading(false);
  }, []);

  return (
    <Layout>
      <Filter filters={filtersValues} />
      <div className="jobs">
        <div className="cards">
          {loading ? (
            [...Array(5).keys()].map((i) => <SkeletonJob key={i} />)
          ) : (
            <>
              {jobs.length === 0 ? (
                <div>Sorry but no jobs corresponding to your filters...</div>
              ) : (
                jobs.map((job, i) => {
                  return (
                    <Job
                      key={i}
                      job={job}
                      active={i === index}
                      position={[i, jobs.length]}
                      onClick={() => setIndex(i)}
                      infiniteScroll={() => infiniteScroll()}
                    />
                  );
                })
              )}
              {loadingMore && <Loading />}
            </>
          )}
        </div>
        {loading ? (
          <SkeletonJobDetails />
        ) : !jobs[index] ? null : (
          <JobDetails jobId={jobs[index].id} />
        )}
      </div>
    </Layout>
  );
}
