import { API_URL } from "./constants";

/**
 * @class - Customize your fetch request
 * @method call - Configure the fetch call with differents parameters
 */
export default class Fetch {
  static async call(endpoint, method = "GET", payload = {}) {
    const token = localStorage.getItem("token");
    
    let options = {
      method: `${method}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    if (method !== "GET") {
      options = {
        ...options,
        body: JSON.stringify(payload),
      };
    }

    const response = await fetch(API_URL + endpoint, options);

    if (!response.ok) {
      console.log(response);
      return false;
    }
    return response.json();
  }
}
