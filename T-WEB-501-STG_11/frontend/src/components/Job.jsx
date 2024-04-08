import "JQ/styles/components/Job.css";
import LocationIcon from "./Icons/LocationIcon";
import { useRef, useEffect, useState } from "react";
import ApplyButton from "JQ/components/ApplyButton";

export default function Job({
  job,
  active,
  onClick,
  position,
  showApply = true,
  infiniteScroll = () => {},
}) {
  const [mobileMoreActive, setMobileMoreActive] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (position[0] === position[1] - 1) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            infiniteScroll();
          }
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.1,
        }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }
  }, []);

  return (
    <div
      className={`card ${active ? "active" : ""} ${
        mobileMoreActive ? " mobile-active" : ""
      }`}
      onClick={() => {
        onClick();
        setMobileMoreActive(!mobileMoreActive);
      }}
      ref={ref}
    >
      <div className="card__header">
        <div className="card__label">{job.label}</div>
        <div className="card__company">{job.company?.label}</div>
        <div className="card__location">
          <LocationIcon />
          {job.region?.label}
        </div>
        <div className="card__short-description">{job.description}</div>
      </div>
      <div className="actions">
        {showApply ? (
          <ApplyButton className="card__apply" jobId={job.id} />
        ) : (
          <></>
        )}
        <button
          className="card__more"
          onClick={() => {
            onClick();
            setMobileMoreActive(!mobileMoreActive);
          }}
        >
          Learn more
        </button>
      </div>
    </div>
  );
}
