import {
  StyleSheet,
  Alert,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Text,
} from "react-native";
import React, { useState } from "react";
import { Redirect } from "expo-router";

import { useAuth } from "@/hooks";
import { Trello } from "@/api";

import { Spinner } from "@/components";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiToken, onChangeApiToken] = useState(
    process.env.EXPO_PUBLIC_API_TOKEN ?? ""
  );

  const { token, auth } = useAuth();

  const image = "../assets/logo.png";

  const handleValidation = async () => {
    setIsLoading(true);

    const user = await Trello.attempt(apiToken);

    if (!user) {
      setIsLoading(false);
      setError("Your token is invalid");
      return;
    }

    auth(apiToken, user);
    setIsLogged(true);
  };

  if (isLogged) {
    return <Redirect href="/pages/home" />;
  }

  return (
    <View style={styles.container}>
      <Image source={require(image)} style={styles.logo} resizeMode="contain" />
      {isLoading ? (
        <Spinner />
      ) : (
        <View style={{ width: "100%", alignItems: "center" }}>
          {error && (
            <View style={styles.error}>
              <Text style={styles.errorText} id="error-message">{error}</Text>
            </View>
          )}
          <TextInput
            style={styles.input}
            onChangeText={onChangeApiToken}
            value={apiToken}
            placeholder="Enter your token"
            id="api-token"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleValidation}
            id="sign-in"
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e0e0f",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -50,
  },
  logo: {
    height: 300,
    marginTop: -50,
  },
  input: {
    backgroundColor: "white",
    height: 40,
    borderRadius: 10,
    textAlign: "center",
    marginBottom: 15,
    maxWidth: 300,
    width: "100%",
  },
  button: {
    color: "white",
    padding: 10,
    backgroundColor: "#0079bf",
    borderRadius: 10,
    maxWidth: 300,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  error: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
    marginBottom: 30,
    maxWidth: 300,
    width: "100%",
    alignItems: "center",
  },
  errorText: {
    color: "white",
  }
});
