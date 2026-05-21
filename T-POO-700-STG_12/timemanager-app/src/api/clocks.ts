import { Fetch, Method } from "./fetch";

export class Clocks {
  static getClocks(): Promise<any> {
    return Fetch.call("/clocks", Method.GET);
  }

  static getUserClocks(userId: string): Promise<any> {
    return Fetch.call(`/clocks/${userId}`, Method.GET);
  }

  static getLastUserClock(userId: string): Promise<any> {
    return Fetch.call(`/clocks/${userId}/last`, Method.GET);
  }

  static createClock(userId: string, data: { [key: string]: any }): Promise<any> {
    return Fetch.call(`/clocks/${userId}`, Method.POST, data);
  }

  static updateClock(id: string, data: { [key: string]: any }): Promise<any> {
    return Fetch.call(`/clocks/${id}`, Method.PUT, data);
  }

  static deleteClock(id: string): Promise<any> {
    return Fetch.call(`/clocks/${id}`, Method.DELETE);
  }

}