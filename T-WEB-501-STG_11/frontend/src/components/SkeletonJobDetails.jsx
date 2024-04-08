import "JQ/styles/components/SkeletonJobDetails.css";

export default function SkeletonJobDetails() {
  return (
    <section className="job-details skeleton">
      <div className="job-details__header">
        <div className="title rectangle"></div>
        <div className="company rectangle"></div>
        <div className="location rectangle"></div>
        <div className="salary rectangle"></div>
        <div className="type rectangle"></div>
      </div>
      <div className="job-details__content">
        <div className="title rectangle"></div>
        <div className="underline rectangle"></div>
        <div className="job-details__description"></div>
      </div>
    </section>
  );
}
