import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface HeaderProps {
  title: string;
  triggerOptionsModal?: () => void;
}

export const Header: React.FC<HeaderProps> = (props) => {
  const { title, triggerOptionsModal } = props;

    return (
      <View style={styles.container} id="page-title">
        <Text style={styles.title}>{title}</Text>

        <View>
          <TouchableOpacity onPress={triggerOptionsModal}>
            <View>
              <FontAwesome
                id="create-modal"
                name="plus"
                size={24}
                color="white"
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );


};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    borderBlockStartColor: "#3a3a3c",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 90,
    paddingBottom: 15,
    paddingLeft: 20,
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    color: "white",
  },
  icon: {
    marginLeft: "auto",
    marginRight: 20,
  },
});
