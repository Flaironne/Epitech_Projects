"use client";
import Layout from "JQ/components/Layout";
import { getCompanies } from "JQ/services/api/companies";
import { useEffect, useState } from "react";
import Company from "JQ/components/Company";
import "JQ/styles/components/Company.css";
import "JQ/styles/components/SkeletonCompany.css";
import SkeletonCompany from "JQ/components/SkeletonCompany"
import Title from "JQ/components/Title"

export default function Home() {
  const [loading, setLoading] = useState(true); 
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getCompanies();
      setCompanies(data);
      setLoading(false);
    })();
  }, []);

  return (
    <Layout>
      <Title content="Companies"/>
      <ul className="companies">
        {
          loading ? (
            [...Array(5).keys()].map((i) => <SkeletonCompany key={i} />)
          ):
        companies.map((company, i) => {
          return (
            <Company
              key={i}
              company={{
                ...company,
                logo: "logo.jpg",
              }}
            />
          );
        })
        
        }
      </ul>
    </Layout>
  );
}
