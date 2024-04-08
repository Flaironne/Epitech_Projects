"use client";
import Layout from "JQ/components/Layout";
import useAuth from "JQ/hooks/auth";
import { useEffect, useState } from "react";
import Title from "JQ/components/Title"
import Notification from "JQ/components/Notification"
import "JQ/styles/components/Notification.css"
import { getNotifications } from "JQ/services/api/notifications"

export default function Home() {
  const { user } = useAuth({ middleware: "private", role: "admin" });
  const [loading, setLoading] = useState(true);
  const [notifications, setNotification] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getNotifications();
      setNotification(data);
      setLoading(false);
    })();
  }, []);

  return (
    <Layout>
      <Title content="Notifications"/>
      <ul className="notifications">
        
      {notifications.length === 0 ? (
                <div>Sorry but you don&apos;t have notifications...</div>
              ) :
        notifications.map((notification, i) => {
          return (
            <Notification
              key={i}
              notification={notification}
              index = {i+1}
            />
          );
        })}
        
      </ul>
    </Layout>
  );
}