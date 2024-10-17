import React from "react";
import { ActivityIndicator, View } from "react-native";

interface SpinnerProps {
  size?: number;
  style?: { [key: string]: string | number };
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = (props: SpinnerProps) => {
  const { size = 75, style, color = "white" } = props;

  return (
    <View>
      <ActivityIndicator size={size} style={style} color={color} />
    </View>
  );
};
