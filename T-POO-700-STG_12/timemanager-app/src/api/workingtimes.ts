import { Fetch, Method } from "./fetch";

export class WorkingTimes {
  static getWorkingTimes(): Promise<any> {
    return Fetch.call("/workingtimes", Method.GET);
  }

  static getUserWorkingTimes(userId: string): Promise<any> {
    return Fetch.call(`/workingtimes/${userId}`, Method.GET);
  }

  static createWorkingTime(userId: string, data: { [key: string]: any }): Promise<any> {
    return Fetch.call(`/workingtimes/${userId}`, Method.POST, data);
  }

  static updateWorkingTime(id: string, data: { [key: string]: any }): Promise<any> {
    return Fetch.call(`/workingtimes/${id}`, Method.PUT, data);
  }

  static deleteWorkingTime(id: string): Promise<any> {
    return Fetch.call(`/workingtimes/${id}`, Method.DELETE);
  }

}