import "JQ/styles/components/SkeletonJob.css";

export default function SkeletonJob() {
  return (
    <div className="card skeleton">
      <div className="header">
        <div className="card__label rectangle"></div>
        <div className="card__company rectangle"></div>
        <div className="card__location rectangle"></div>
        <div className="card__short-description rectangle">
          {[...Array(5).keys()].map((i) => (
            <div key={i} className="line"></div>
          ))}
        </div>
      </div>
      <div className="actions">
        <button className="card__apply"></button>
        <button className="card__more"></button>
      </div>
    </div>
  );
}
