import Fetch from "../Fetch";

export async function getCompanies() {
  return Fetch.call(`/companies`);
}