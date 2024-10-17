import { Slot } from "expo-router";
import { View } from "react-native";
import { UserContext, UserProvider } from "./contexts/userContext";

export default function HomeLayout() {
  return (
    <UserProvider>
        <Slot />
    </UserProvider>
  );
}
