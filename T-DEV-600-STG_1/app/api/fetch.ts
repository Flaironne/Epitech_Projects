import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export class Fetch {
  private static baseURL: string = process.env.EXPO_PUBLIC_BASE_URL ?? "";
  private static token: string = "";
  private static key: string = process.env.EXPO_PUBLIC_API_KEY ?? "";

  static setToken(token: string) {
    this.token = token;
  }

  private static getUrl(
    endpoint: string,
    method: Method,
    body?: { [key: string]: string }
  ): string {
    let baseUrl = this.baseURL
      .replace("[]", endpoint)
      .replace("apiToken", this.token)
      .replace("apiKey", this.key);

    if (endpoint === "/batch") {
      return `${baseUrl}&urls=${body?.urls}`;
    }

    if (body && body.idMembers) {
      baseUrl += `&idMembers=${body.idMembers}`;
      delete body.idMembers;
    }

    const hasQuery = body && Object.keys(body).length > 0;

    if (hasQuery) {
      baseUrl += `&${new URLSearchParams(body || {}).toString()}`;
    }

    console.log(`Fetching: ${baseUrl}`);

    return baseUrl;
  }

  static async call(
    endpoint: string,
    method: Method = Method.GET,
    body?: { [key: string]: string }
  ) {

    const response = await fetch(this.getUrl(endpoint, method, body), {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    try {
      return await response.json();
    } catch (e) {
      console.error(`Error during fetch: ${e}`);
      return null;
    }
  }
}
