import Fetch from "../Fetch";

export async function getNotifications() {
  return Fetch.call(`/me/notifications`);
}