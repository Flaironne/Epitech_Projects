import "JQ/styles/components/SkeletonCompany.css";

export default function SkeletonCompany() {
  return (
    <div className="skeleton__companyCard">
        <div className="skeleton__companyLogo"></div>
        <div className="skeleton__companyInformation">
            <div className="skeleton__companyName"></div>
            <div className="skeleton__companyRate"></div>
            <div className="skeleton__companyOfferNb"></div>
        </div>
    </div>
  );
}
