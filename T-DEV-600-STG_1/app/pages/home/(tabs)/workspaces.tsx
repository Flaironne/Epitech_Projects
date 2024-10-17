import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { Trello } from "@/api";
import { Workspace } from "@/types";

import { Header, Spinner, Boards, DeleteModal } from "@/components";
import { AddModal } from "../../../components/Modal/AddWorkspaceModal";
import { UpdateWorkspaceModal } from "../../../components/Modal/UpdateWorkspaceModal";
import { AddBoardModal } from "../../../components/Modal/AddBoardModal";

const TrelloPage: React.FC = () => {
  const [workspaces, setWorkspace] = useState<Workspace[]>();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );
  const [isBoardMode, setIsBoardMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [workspaceId, setWorkspaceId] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [formSubmit, setFormSubmit] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [showAddBoardModal, setShowAddBoardModal] = useState<boolean>(false);

  const triggerDeleteModal = (name: string, id: string) => {
    setShowDeleteModal(true);
    setWorkspaceName(name);
    setWorkspaceId(id);
  };

  const cancelModal = () => {
    setShowDeleteModal(false);
  };

  const deleteWorkspace = (id: string) => {
    Trello.deleteWorkspace(id).then((res) => {
      onRefresh();
    });
    setShowDeleteModal(false);
  };

  const triggerAddModal = () => {
    if (isBoardMode) {
      setShowAddBoardModal(true);
    } else {
      setShowAddModal(true);
    }
  };

  const cancelAddModal = () => {
    setShowAddModal(false);
    setShowAddBoardModal(false);
  };

  const triggerUpdateModal = (name: string, id: string) => {
    setShowUpdateModal(true);
    setWorkspaceName(name);
    setWorkspaceId(id);
  };

  const cancelUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const onPress = (workspace: Workspace) => {
    console.log(workspace);
    setCurrentWorkspace(workspace);
    setIsBoardMode(true);
  };

  const back = () => {
    setCurrentWorkspace(null);
    setIsBoardMode(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    Trello.workspaces().then((res) => {
      setWorkspace(res);
      setRefreshing(false);
    });
  };

  useEffect(() => {
    Trello.workspaces().then((res) => {
      setWorkspace(res);
    });
  }, []);

  const hasCurrentWorkspace =
    isBoardMode && currentWorkspace && currentWorkspace.id;

  return (
    <View style={styles.container}>
      <Header
        title={`${hasCurrentWorkspace ? currentWorkspace.name : "Workspaces"}`}
        triggerOptionsModal={triggerAddModal}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {refreshing ? null : !hasCurrentWorkspace ? (
          <View>
            {workspaces ? (
              workspaces.map((workspace: any, index: number) => (
                <View key={workspace.id}>
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginRight: 10,
                      }}
                    >
                      <Text
                        style={styles.text}
                        onPress={() =>
                          triggerUpdateModal(
                            workspace.displayName,
                            workspace.id
                          )
                        }
                        onLongPress={() =>
                          triggerDeleteModal(
                            workspace.displayName,
                            workspace.id
                          )
                        }
                      >
                        {workspace.displayName}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginRight: 10,
                        }}
                      >
                        <Text
                          style={styles.link}
                          onPress={() => onPress(workspace)}
                        >
                          Boards
                        </Text>
                        <AntDesign
                        id={`workspace-${index}`}
                          name="right"
                          size={18}
                          color="#5D9DD6"
                          style={{ alignItems: "center", marginTop: 3 }}
                          onPress={() => onPress(workspace)}
                        />
                      </View>
                    </View>
                    <Boards workspacesId={workspace.id} routing={true} />
                  </View>
                </View>
              ))
            ) : (
              <Spinner />
            )}
            {showDeleteModal && (
              <DeleteModal
                title={workspaceName}
                visible={showDeleteModal}
                onCancel={cancelModal}
                onDelete={() => deleteWorkspace(workspaceId)}
              />
            )}

            {showUpdateModal && (
              <UpdateWorkspaceModal
                visible={showUpdateModal}
                onRefresh={onRefresh}
                onCancel={cancelUpdateModal}
                initialName={workspaceName}
                workspaceId={workspaceId}
              />
            )}

            {showAddModal && (
              <AddModal
                visible={showAddModal}
                onRefresh={onRefresh}
                onCancel={cancelAddModal}
              />
            )}
          </View>
        ) : (
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <AntDesign
                name="left"
                size={24}
                style={styles.link2}
                onPress={back}
              />
              <Text style={styles.link2} onPress={back}>
                Go back
              </Text>
            </View>
            <Text style={styles.text} id="show-workspace-boards">Boards</Text>
            <Boards workspacesId={currentWorkspace.id} routing={false} />
            {currentWorkspace && showAddBoardModal && (
              <AddBoardModal
                visible={showAddBoardModal}
                onRefresh={onRefresh}
                onCancel={cancelAddModal}
                workspaceId={currentWorkspace.id}
              />
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#0e0e0f",
  },
  text: {
    color: "#D3D3D3",
    fontSize: 20,
    marginVertical: 20,
    marginLeft: 15,
  },
  link: {
    color: "#5D9DD6",
    fontSize: 20,
    marginVertical: 20,
    marginLeft: 20,
  },
  link2: {
    color: "grey",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
    marginLeft: 20,
  },
});

export default TrelloPage;
