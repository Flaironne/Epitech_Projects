import { useRouter } from "next/navigation";
import Stars from "./Icons/Stars";
import Image from "next/image";

export default function Company({ company }) {
  function makeStar(starsNb) {
    let array = [];
    for (let i = 0; i < 5; i++) {
      array.push(<Stars filled={i < starsNb} />);
    }
    return array;
  }

  const router = useRouter();

  function search() {
    router.push("/?search=" + company.label);
  }

  return (
    <li className="companyCard" onClick={search}>
      <div className="companyLogo">
        <Image
          src={`/${company.logo}`}
          alt={company.label}
          width={120}
          height={120}
        />
      </div>
      <div className="companyInformation">
        <div className="companyName">{company.label}</div>
        <div className="companyRate">{makeStar(company.stars)}</div>
        <div className="companyOfferNb">
          {company.jobs_count} {company.jobs_count == 1 ? "offer" : "offers"}
        </div>
      </div>
    </li>
  );
}
