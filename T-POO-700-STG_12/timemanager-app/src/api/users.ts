import { Fetch, Method } from "./fetch";

export class Users {
  static getUsers(): Promise<any> {
    return Fetch.call("/users", Method.GET);
  }

  static getUser(id: string): Promise<any> {
    return Fetch.call(`/users/${id}`, Method.GET);
  }

  static createUser(data: { [key: string]: any }): Promise<any> {
    return Fetch.call("/users", Method.POST, data);
  }

  static updateUser(id: string, data: { [key: string]: any }): Promise<any> {
    return Fetch.call(`/users/${id}`, Method.PUT, data);
  }

  static deleteUser(id: string): Promise<any> {
    return Fetch.call(`/users/${id}`, Method.DELETE);
  }

  static registerUser(data: { [key: string]: any }): Promise<any> {
    return Fetch.call("/register", Method.POST, data);
  }

}