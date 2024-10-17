import { BatchResponse, Card as CardType, User } from "@/types";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, StyleSheet, Image, View } from "react-native";
import { Trello } from "@/api";

interface CardProps {
  card: CardType;
  onPress?: () => void;
  onLongPress?: () => void;
}

type UsersBatchResponse = BatchResponse<User>[];

export const Card: React.FC<CardProps> = (props) => {
  const { card, onPress, onLongPress } = props;

  const [avatars, setAvatars] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    if (card.idMembers.length === 0) return;

    Trello.batch<UsersBatchResponse>(
      card.idMembers.map((id) => `/members/${id}`)
    ).then((batchResponse: UsersBatchResponse) => {
      batchResponse?.forEach((r) => {
        setAvatars((prev) => ({
          ...prev,
          [r[200].id]: [...(prev[r[200].id] ?? []), r[200].avatarUrl],
        }));
      });
    });
  }, []);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onLongPress={onLongPress}
      onPress={onPress}
    >
      <Text style={styles.cardName}>{card.name}</Text>

      <View
        style={{ flexDirection: "row", justifyContent: "flex-end", gap: 4 }}
      >
        {card.idMembers.map((id) => (
          <Image
            key={id}
            source={{ uri: `${avatars[id]?.[0]}/30.png` }}
            style={{ width: 30, height: 30, borderRadius: 50 }}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#3a3a3c",
    width: "100%",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardName: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginBottom: 8,
  },
  content: {
    color: "white",
    fontSize: 16,
  },
});
