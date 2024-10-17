import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      id="tabs"
      screenOptions={{
        tabBarActiveTintColor: "#5D9DD6",
        tabBarInactiveTintColor: "#D3D3D3",
        tabBarActiveBackgroundColor: "black",
        tabBarInactiveBackgroundColor: "black",
        headerTintColor: "white",
        tabBarStyle: {
          backgroundColor: "black",
          borderTopColor: "black ",
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="workspaces"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="trello" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="dashboard" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={26} name="user" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wordle"
        options={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={26} name="gamepad" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
