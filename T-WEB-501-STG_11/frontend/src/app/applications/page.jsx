"use client";
import Job from "JQ/components/Job";
import JobDetails from "JQ/components/JobDetails";
import Layout from "JQ/components/Layout";
import SkeletonJob from "JQ/components/SkeletonJob";
import SkeletonJobDetails from "JQ/components/SkeletonJobDetails";
import useAuth from "JQ/hooks/auth";
import { getJobApp } from "JQ/services/api/jobApplications";
import { useEffect, useState } from "react";
import Title from "JQ/components/Title"

export default function Home() {
  const { user } = useAuth({ middleware: "private" });
  const [loading, setLoading] = useState(true);

  const [jobApps, setJobApps] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    (async () => {
      const data = await getJobApp();
      setJobApps(data);
      setLoading(false);
    })();
  }, []);

  return (
    <Layout>
      <Title content="Job Applications"/>
      <div className="jobs">
        <div className="cards">
          {loading || !jobApps ? (
            [...Array(5).keys()].map((i) => <SkeletonJob key={i} />)
          ) : (
            <>
              {jobApps.length === 0 ? (
                <div className="page__description">
                  Sorry but you don&apos;t have any job applications...
                </div>
              ) : (
                jobApps.map((jobApp, i) => {
                  return (
                    <Job
                      key={i}
                      job={jobApp.job}
                      active={i === index}
                      position={[i, jobApps.length]}
                      onClick={() => setIndex(i)}
                      showApply={false}
                    />
                  );
                })
              )}
            </>
          )}
        </div>
        {loading ? (
          <SkeletonJobDetails />
        ) : !jobApps[index] ? null : (
          <JobDetails jobId={jobApps[index].job.id} showApply={false} />
        )}
      </div>
    </Layout>
  );
}
