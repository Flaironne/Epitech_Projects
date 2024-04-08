import Fetch from "../Fetch";

export async function getJobApp() {
  return Fetch.call(`/me/applications`);
}