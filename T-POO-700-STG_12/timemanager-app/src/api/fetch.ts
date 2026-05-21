export enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export class Fetch {
  /* static getUserData(): any {
    throw new Error("Method not implemented.");
  } */
  private static baseURL: string = "/api";
  private static token: string = "";

  static setToken(token: string) {
    this.token = token;
  }
 
  static getUser() {
    return this.call("/me", Method.GET);
  }

  private static getUrl(endpoint: string): string {
    if (!this.baseURL) {
      throw new Error(
        "Base URL is not defined. Please check your environment configuration.",
      );
    }
    let baseUrl = this.baseURL + endpoint;
    return baseUrl;
  }

  static async addRequestToQueue(endpoint, method, body) {
    const offlineRequests = JSON.parse(localStorage.getItem('offlineRequests')) || [];
    offlineRequests.push({ endpoint, method, body });
    localStorage.setItem('offlineRequests', JSON.stringify(offlineRequests));
  }  

  static async call(
    endpoint: string,
    method: Method = Method.GET,
    body?: { [key: string]: string },
  ) {
    const url = this.getUrl(endpoint);

    if (!url) {
      throw new Error("Cannot load an empty URL");
    }

    if (!navigator.onLine) {
      // If offline, add the request to the queue
      await this.addRequestToQueue(endpoint, method, body);
      throw new Error('You are currently offline. The request has been queued for later.');
    }

    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: method == Method.PUT || method == Method.POST ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData);
      const errorMessages = Object.entries(errorData.errors || {})
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join(' | ');
      console.log(errorMessages);
      throw new Error(errorMessages || 'An error occurred');
    }

    try {
      let r = await response.json();
      return r.data;
    } catch (e) {
      console.error(`Error during fetch: ${e}`);
      return null;
    }
  }

  static async syncOfflineRequests() {
    const offlineRequests = JSON.parse(localStorage.getItem('offlineRequests')) || [];
    for (const request of offlineRequests) {
      try {
        await this.call(request.endpoint, request.method, request.body);
        console.log(`Synchronized request: ${request.method} ${request.endpoint}`);
      } catch (error) {
        console.error('Failed to sync request:', error);
      }
    }
    // Clear the offline requests after successful sync
    localStorage.removeItem('offlineRequests');
  }
}