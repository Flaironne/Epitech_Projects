import {
  View,
  Text,
  StyleSheet,
  Image,
  Touchable,
  TouchableOpacity,
} from "react-native";

import { Header } from "@/components";
import { useAuth } from "@/hooks";
import { router } from "expo-router";

export default function Tab() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Header title="Account" />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{ uri: `${user?.avatarUrl}/30.png` }}
          style={{ width: 30, height: 30, borderRadius: 50, marginLeft: 20 }}
        />
        <Text style={styles.text}>{user?.fullName}</Text>
      </View>

      <Text style={styles.text}>{user?.username}</Text>
      <Text style={styles.text}>{user?.email}</Text>
      <TouchableOpacity onPress={() => {
        logout();
        router.navigate("/");
      }} style={styles.button} id="logout-button">
        <Text style={styles.text}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#0e0e0f",
  },
  button: {
    marginTop: 40,
    maxWidth: 380,
    alignSelf: "center",
    color: "white",
    backgroundColor: "#0079bf",
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  text: {
    color: "#D3D3D3",
    fontSize: 20,
    marginVertical: 20,
    marginLeft: 20,
  },
});
