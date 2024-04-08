import "JQ/styles/components/Notification.css";
import { useRouter } from "next/navigation";

export default function Notification({ notification ,index}) {
  const router = useRouter();

  function search() {
    router.push("/?search=" + notification.job?.label);
  }
  
  return (
    <li className="notificationCard" onClick={search}>
      <div id="notification__ID">{index}</div>
      <div className="notificationType">{notification.label}</div>
      <div className="jobDescription">{notification.description}</div>
    </li>
  );
}

