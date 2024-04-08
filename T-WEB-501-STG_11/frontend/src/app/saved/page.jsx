"use client";
import Job from "JQ/components/Job";
import JobDetails from "JQ/components/JobDetails";
import Layout from "JQ/components/Layout";
import SkeletonJob from "JQ/components/SkeletonJob";
import SkeletonJobDetails from "JQ/components/SkeletonJobDetails";
import useAuth from "JQ/hooks/auth";
import { API_URL, headers } from "JQ/services/constants";
import { useEffect, useState } from "react";
import Title from "JQ/components/Title";

export default function Home() {
  const { user } = useAuth({ middleware: "private" });
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    (async () => {
      fetch(API_URL + "/me/likes", {
        headers: {
          ...headers,
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setLikes(data);
          setLoading(false);
        });
    })();
  }, []);

  return (
    <Layout>
      <Title content="Saved jobs"/>
      <div className="jobs">
        <div className="cards">
          {loading || !likes ? (
            [...Array(5).keys()].map((i) => <SkeletonJob key={i} />)
          ) : (
            <>
              {likes.length === 0 ? (
                <div>Sorry but you don&apos;t have any likes...</div>
              ) : (
                likes.map((like, i) => {
                  return (
                    <Job
                      key={i}
                      job={like.job}
                      active={i === index}
                      position={[i, likes.length]}
                      onClick={() => setIndex(i)}
                    />
                  );
                })
              )}
            </>
          )}
        </div>
        {loading ? (
          <SkeletonJobDetails />
        ) : !likes[index] ? null : (
          <JobDetails jobId={likes[index].job.id} />
        )}
      </div>
    </Layout>
  );
}
