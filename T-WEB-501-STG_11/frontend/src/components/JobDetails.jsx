import "JQ/styles/components/JobDetails.css";
import Link from "next/link";
import LocationIcon from "./Icons/LocationIcon";
import BookmarkIcon from "./Icons/BookmarkIcon";
import ApplyIcon from "./Icons/ApplyIcon";
import useAuth from "JQ/hooks/auth";
import { useEffect, useState } from "react";
import ApplyButton from "JQ/components/ApplyButton";
import SkeletonJobDetails from "./SkeletonJobDetails";
import { API_URL } from "JQ/services/constants";
import useLike from "JQ/hooks/like";
import Loading from "./Loading";

export default function JobDetails({ jobId, showApply = true }) {
  const { user, isLogged } = useAuth();
  const { isLoading, isLiked, like, unlike } = useLike({
    job: jobId,
    isLogged: isLogged,
    user: user,
  });
  const [bookmarkActive, setBookmarkActive] = useState(false);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(API_URL + "/jobs/" + jobId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setJob(res);
        setTimeout(() => {
          setLoading(false);
        }, 100);
      });
  }, [jobId]);

  const humanizeDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const handleBookmark = () => {
    console.log("handleBookmark", jobId, isLiked);
    if (isLiked) {
      unlike(jobId);
    } else {
      like(jobId);
    }
  };

  return loading ? (
    <SkeletonJobDetails />
  ) : (
    <section className="job-details">
      <div className="job-details__header">
        <div className="job-details__container">
          <div className="title">{job.label}</div>
          <div className="icons">
            {showApply ? (
              <ApplyButton
                className="applyIcon"
                title="Apply to this job"
                jobId={job.id}
                content={<ApplyIcon />}
              />
            ) : (
              <></>
            )}
            {isLogged ? (
              isLoading ? (
                <Loading />
              ) : (
                <div
                  onClick={handleBookmark}
                  title="Save this job to your bookmarks"
                  className={`bookmark ${isLiked ? "active" : null}`}
                >
                  <BookmarkIcon />
                </div>
              )
            ) : null}
          </div>
        </div>
        <div className="company">
          <Link href={"/?search=" + job.company.label}>
            {job.company?.label}
          </Link>
        </div>
        <div className="location">
          <LocationIcon />
          {job.region?.label}
        </div>
        <div className="salary">
          <span className="salary__value">{job.salary}€</span>
          <span className="salary__type"> per month</span>
        </div>
        {job.type?.label} - {job.workplace?.label} - {job.duration}
      </div>
      <div className="job-details__content">
        <div className="title">Job details</div>
        <div className="underline"></div>
        <div className="job-details__description">{job.description}</div>
        <div className="published_at">
          Published on {humanizeDate(job.created_at)}
        </div>
      </div>
    </section>
  );
}
