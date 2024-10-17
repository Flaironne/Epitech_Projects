import React, { useState } from "react";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Board as BoardType } from "@/types";

import { DeleteModal } from "./Modal/DeleteModal";

interface BoardProps {
  board: BoardType;
  onLongPress?: () => void;
  onPress?: () => void;
  routing: boolean;
}

export const Board: React.FC<BoardProps> = (props) => {
  const { board, onLongPress = () => {} , routing, onPress} = props;
  
  const onRouting = () => {
    if (!board.id || !board.name) return;

    router.push({
      pathname: "/pages/board",
      params: { boardId: board.id, boardName: board.name },
    });
  };

  return (
    <TouchableOpacity
      onPress={routing ? onRouting : onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
      key={board.id}
    >
      <View style={styles.boardInfo}>
        {board.prefs.backgroundColor ? (
          <View
            style={{
              ...styles.image,
              backgroundColor: board.prefs.backgroundColor,
            }}
          ></View>
        ) : (
          <Image
            source={{
              uri: board.prefs.backgroundImage,
            }}
            style={styles.image}
          />
        )}
        <Text key={board.id} style={styles.text}>
          {board.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  text: {
    color: "#D3D3D3",
    fontSize: 20,
    marginLeft: 10,
  },
  boardInfo: {
    flexDirection: "row",
    marginLeft: 7,
    alignItems: "center",
  },
});
