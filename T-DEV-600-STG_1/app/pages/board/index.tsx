import React, { useEffect, useState } from "react";
import { Dimensions, View, Text, StyleSheet, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Trello } from "@/api";
import {
  BatchResponse,
  Board,
  Card as CardType,
  List as ListType,
  User,
} from "@/types";

import { Header, Card, Spinner, DeleteModal } from "@/components";
import { AddListModal } from "../../components/Modal/AddListModal";
import { UpdateListModal } from "../../components/Modal/UpdateListModal";
import {
  AddCardModal,
  Card as ICard,
} from "../../components/Modal/AddCardModal";
import { UpdateCardModal } from "../../components/Modal/UpdateCardModal";

type List = {
  list: ListType;
  cards: CardType[];
};

type CardsBatchResponse = BatchResponse<CardType[]>[];

const BoardPage: React.FC = () => {
  const { boardId, boardName } = useLocalSearchParams();

  const isValid =
    typeof boardId === "string" &&
    boardId.length > 0 &&
    typeof boardName === "string" &&
    boardName.length > 0;

  const [lists, setLists] = useState<List[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState(0);
  const [card, setCard] = useState<CardType | null>(null);
  const [list, setList] = useState<ListType | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditCardModal, setShowEditCardModal] = useState(false);
  const [showCardDeleteModal, setShowCardDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  const [workspaceMembers, setWorkspaceMembers] = useState<User[]>([]);

  const width = Dimensions.get("window").height;

  const fetchLists = () => {
    if (!isValid) return;
    setIsLoading(true);

    const _lists: List[] = [];

    Trello.lists(boardId).then((res: ListType[]) => {
      if (res.length === 0) {
        setIsLoading(false);
        return;
      }

      res.map((list) => {
        _lists.push({
          list,
          cards: [],
        });
      });

      Trello.batch<CardsBatchResponse>(
        res.map((list) => `/lists/${list.id}/cards`)
      ).then((batchResponse: CardsBatchResponse) => {
        if (!batchResponse) {
          setIsLoading(false);
          return;
        }

        batchResponse?.forEach((r) => {
          if (!r[200][0]?.idList) return;

          let currentList = r[200][0].idList;

          _lists.forEach((l) => {
            if (l.list.id === currentList) {
              l.cards = r[200];
            }
          });
        });

        setLists(_lists);
        setPosition(0);
        setIsLoading(false);
      });
    });
  };

  useEffect(() => {
    if (!isValid) return;

    Trello.board(boardId).then((res: Board) => {
      Trello.workspaceMembers(res.idOrganization).then((res) => {
        setWorkspaceMembers(res);
      });
    });

    fetchLists();
  }, []);

  const deleteCard = () => {
    if (!card) return;

    Trello.deleteCard(card.id).then(() => {
      fetchLists();
      setCard(null);
      setShowCardDeleteModal(false);
    });
  };

  const deleteList = () => {
    if (!list) return;

    Trello.deleteList(list.id).then(() => {
      fetchLists();
      setList(null);
      setShowDeleteModal(false);
    });
  };

  if (!isValid) {
    return (
      <View style={styles.container}>
        <Header title="Board not found" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={boardName}
        triggerOptionsModal={() => {
          setShowCreateModal(true);
        }}
      />
      {isLoading ? (
        <Spinner
          size={32}
          style={{
            width: "100%",
            alignItems: "center",
            marginTop: 32,
          }}
        />
      ) : lists.length > 0 ? (
        <>
          <Indicator index={position} length={lists.length} />
          <Carousel
            loop={false}
            width={width}
            defaultIndex={0}
            height={width}
            style={{ borderWidth: 0, borderColor: "#0e0e0f", marginTop: 8 }}
            onSnapToItem={(index) => {
              setPosition(index);
            }}
            data={lists}
            panGestureHandlerProps={{
              activeOffsetX: [-10, 10],
            }}
            scrollAnimationDuration={0}
            renderItem={({ item }) => (
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-start",
                }}
              >
                <ScrollView style={styles.scrollView}>
                  <View style={styles.listContainer}>
                    <View style={styles.listHeader}>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.listTitle}
                        onPress={() => {
                          setList(item.list);
                          setShowEditModal(true);
                        }}
                      >
                        {item.list.name}
                      </Text>
                      <View>
                        <FontAwesome
                          name="minus"
                          size={18}
                          onPress={() => {
                            setList(item.list);
                            setShowDeleteModal(true);
                          }}
                          color="white"
                          style={styles.icon}
                        />
                      </View>
                    </View>

                    {item.cards.map((card, index) => {
                      return (
                        <View key={index} style={styles.cardList}>
                          <Card
                            card={card}
                            onLongPress={() => {
                              setCard(card);
                              setShowCardDeleteModal(true);
                            }}
                            onPress={() => {
                              setCard(card);
                              setShowEditCardModal(true);
                            }}
                          />
                        </View>
                      );
                    })}

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        setList(item.list);
                        setShowAddCardModal(true);
                      }}
                      style={styles.listFooter}
                    >
                      <FontAwesome name="plus" size={16} color="#D3D3D3" />
                      <Text style={styles.button}>Add a card</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            )}
          />
        </>
      ) : (
        <Text
          style={{
            color: "#D3D3D3",
            textAlign: "center",
            marginTop: 32,
            fontSize: 18,
          }}
        >
          This board has no lists, create one!
        </Text>
      )}

      {list && (
        <DeleteModal
          title={list.name}
          visible={showDeleteModal}
          onCancel={() => {
            setList(null);
            setShowDeleteModal(false);
          }}
          onDelete={deleteList}
        />
      )}

      {card && (
        <DeleteModal
          title={card.name}
          visible={showCardDeleteModal}
          onCancel={() => {
            setList(null);
            setShowCardDeleteModal(false);
          }}
          onDelete={deleteCard}
        />
      )}

      <AddListModal
        visible={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        onRefresh={(name) => {
          Trello.createList(boardId, name).then((res) => {
            if (!res) return;
            fetchLists();
            setShowCreateModal(false);
          });
        }}
      />

      {card && (
        <UpdateCardModal
          initialCard={{
            name: card.name,
            desc: card.desc,
            idMembers: card.idMembers,
          }}
          workspaceMembers={workspaceMembers}
          visible={showEditCardModal}
          onCancel={() => setShowEditCardModal(false)}
          onRefresh={(_card: ICard) => {
            if (!_card) return;

            Trello.updateCard(card.id, {
              ..._card,
              idMembers: _card.idMembers?.join(","),
            }).then((res) => {
              if (!res) return;
              setCard(null);
              fetchLists();
              setShowEditCardModal(false);
            });
          }}
        />
      )}

      {list && (
        <AddCardModal
          visible={showAddCardModal}
          workspaceMembers={workspaceMembers}
          onCancel={() => setShowAddCardModal(false)}
          onRefresh={(_card: ICard) => {
            if (!_card) return;

            Trello.createCard(list.id, {
              ..._card,
              idMembers: _card.idMembers?.join(","),
            }).then((res) => {
              if (!res) return;
              fetchLists();
              setShowAddCardModal(false);
            });
          }}
        />
      )}

      {list && (
        <UpdateListModal
          visible={showEditModal}
          initialName={list.name}
          onCancel={() => setShowEditModal(false)}
          onRefresh={(name) => {
            if (!list) return;

            Trello.updateList(list.id, name).then((res) => {
              if (!res) return;
              fetchLists();
              setList(null);
              setShowEditModal(false);
            });
          }}
        />
      )}
    </View>
  );
};

interface IndicatorProps {
  index: number;
  length: number;
}

const Indicator = (props: IndicatorProps) => {
  const { index, length } = props;

  return (
    <View
      style={{
        marginTop: 24,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {Array.from({ length }).map((_, i) => (
        <View
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: i === index ? "#D3D3D3" : "#3a3a3c",
            margin: 4,
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#0e0e0f",
  },
  title: {
    color: "#D3D3D3",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  listTitle: {
    color: "#D3D3D3",
    fontSize: 16,
    fontWeight: "bold",
    margin: 16,
  },
  listContainer: {
    backgroundColor: "#3a3a3c",
    margin: 16,
    width: "45%",
    borderRadius: 8,
    marginBottom: 150,
  },
  cardList: {
    flexDirection: "column",
    color: "#D3D3D3",
    alignItems: "center",
  },
  button: {
    color: "#D3D3D3",
    fontSize: 16,
    margin: 16,
    padding: 8,
  },
  spinner: {
    width: "45%",
    alignItems: "center",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  listFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    color: "#D3D3D3",
    marginTop: 16,
    marginRight: 16,
  },
  scrollView: {
    marginBottom: 32,
  },
});

export default BoardPage;
