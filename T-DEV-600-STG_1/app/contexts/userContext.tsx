import React, { ReactElement, createContext, useState } from "react";

import type { User } from "@/types";

export interface UserContextType {
  token: string;
  user: User | null;
  auth: (token: string, user: User) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: { children: ReactElement }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");

  const auth = (token: string, user: User) => {
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    setToken("");
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ token, user, auth, logout }}>
      {children}
    </UserContext.Provider>
  );
};
