import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useEffect, useState } from "react";

import { Board as BoardType, Card as CardType } from "@/types";
import { useAuth } from "@/hooks";
import { Trello } from "@/api";

import { Header, Card, Board } from "@/components";

interface CardPageState {
  board: BoardType;
  cards: CardType[];
}

export default function Tab() {
  const [cardPageState, setCardPageState] = useState<{
    [key: string]: CardPageState;
  }>({});
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuth();

  const fetchCards = () => {
    if (!user || !user.id) return;

    Trello.myBoards(user.id).then((res) => {
      res.forEach((board) => {
        setCardPageState((prev) => {
          return {
            ...prev,
            [board.id]: {
              board,
              cards: [],
            },
          };
        });
      });

      Trello.myCards(user.id).then((res) => {
        res.forEach((card) => {
          setCardPageState((prev) => {
            return {
              ...prev,
              [card.idBoard]: {
                board: prev[card.idBoard].board,
                cards: [...prev[card.idBoard].cards, card],
              },
            };
          });
        });
      });
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCards();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <View style={styles.container}>
      <Header title="My Cards" />
      <ScrollView
        id="cards"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {refreshing ? null : (
          <View>
            {Object.keys(cardPageState).map((key) => {
              return (
                cardPageState[key].cards.length > 0 && (
                  <View key={key}>
                    <View style={styles.boardName}>
                      <Board board={cardPageState[key].board} routing/>
                    </View>
                    {cardPageState[key].cards.map(
                      (card, cardPageStateIndex) => {
                        return (
                          <View
                            key={cardPageStateIndex}
                            style={{
                              alignItems: "center",
                              marginHorizontal: 10,
                              marginBottom: 20,
                            }}
                          >
                            <Card card={card} />
                          </View>
                        );
                      }
                    )}
                  </View>
                )
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#0e0e0f",
    overflow: "scroll",
  },
  boardName: {
    borderRadius: 8,
    fontSize: 20,
    marginTop: 10,
    marginHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20,
  },
  text: {
    color: "#D3D3D3",
    fontSize: 20,
    marginVertical: 20,
    marginLeft: 0,
  },
});
