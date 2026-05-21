export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  managerId: number;
  isEditing?: boolean;
}

export interface Manager {
  id: number;
  username: string;
}

export interface WorkingTime {
  id: number;
  userId: number;
  start: string;
  end: string;
  isEditing?: boolean;
}

export interface Clock {
  id: number;
  userId: number;
  time: string;
  status: boolean;
  isEditing?: boolean;
}