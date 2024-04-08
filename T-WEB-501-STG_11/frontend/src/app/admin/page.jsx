"use client";
import "JQ/styles/tailwind.css";
import { useEffect, useState } from "react";
import Layout from "JQ/components/Layout";
import useAuth from "JQ/hooks/auth";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { API_URL, headers } from "JQ/services/constants";
import Table from "JQ/components/Table";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const { user } = useAuth({ middleware: "private", role: "admin" });
  const [data, setData] = useState([]);
  const searchParams = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab") || "users");

  useEffect(() => {
    fetch(`${API_URL}/${tab}?all=true`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res);
      });
  }, [tab]);

  const tabs = [
    { key: "users", title: "Users" },
    { key: "jobs", title: "Jobs" },
    { key: "companies", title: "Companies" },
    { key: "regions", title: "Regions" },
    { key: "types", title: "Types" },
    { key: "workplaces", title: "Workplaces" },
    { key: "applications", title: "Job applications" },
    { key: "notifications", title: "Notifications" },
    { key: "saved", title: "Saved jobs" },
  ];

  return (
    <Layout mainSize="lg">
      <div className="flex w-full flex-col" style={{ marginTop: "3rem" }}>
        <Tabs
          aria-label="Administration tabs"
          onSelectionChange={(key) => {
            window.history.pushState({
              key,
            }, "", `?tab=${key}`)
            setTab(key);
          }}
          selectedKey={tab}
        >
          {tabs.map((tab) => {
            return (
              <Tab key={tab.key} title={tab.title}>
                <Card>
                  <CardBody>
                    <Table rows={data} name={tab.key} />
                  </CardBody>
                </Card>
              </Tab>
            );
          })}
        </Tabs>
      </div>
    </Layout>
  );
}
