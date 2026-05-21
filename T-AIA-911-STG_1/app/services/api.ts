type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class ApiClient {
  private baseUrl: string;
  private getToken?: () => string | null;

  constructor(baseUrl: string, getToken?: () => string | null) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    this.getToken = getToken;
  }

  private async request<T>(endpoint: string, method: HttpMethod, body?: unknown): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const token = this.getToken?.();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = `${this.baseUrl}${endpoint}`;
    console.log('API Request:', method, url, body);

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log('API Response:', response.status, response.statusText);

    if (!response.ok) {
      const error = await response.text();
      console.log('API Error:', error);
      throw new Error(error || `HTTP ${response.status}`);
    }

    if (response.status === 204 || response.status === 201) {
      return {} as T;
    }

    return response.json();
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, 'GET');
  }

  post<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, 'POST', body);
  }

  put<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, 'PUT', body);
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, 'DELETE');
  }
}
