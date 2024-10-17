import { useContext } from "react";
import { UserContext, UserContextType } from "@/contexts";

export const useAuth = () => {
  const context = useContext<UserContextType>(UserContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
