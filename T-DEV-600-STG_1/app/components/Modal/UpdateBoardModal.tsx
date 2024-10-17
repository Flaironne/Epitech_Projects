import React, { Children, useState } from "react";
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Trello } from "../../api/trello";

interface UpdateModalProps {
  initialName: string;
  boardId: string;
  visible: boolean;
  onRefresh: () => void;
  onCancel: () => void;
}

interface Workspace {
  displayName: string;
  desc?: string;
}

export const UpdateModal: React.FC<UpdateModalProps> = (
  props: UpdateModalProps
) => {
  const { initialName, boardId, visible, onRefresh, onCancel } = props;

  const [boardName, setBoardName] = useState(initialName);

  const onChangeName = (boardName: string) => {
    setBoardName(boardName);
  };

  const updateBoard = (id: string, boardName: string) => {
    Trello.updateBoard(id, boardName).then((res) => {
      onRefresh();
    });
  };

  const onSubmit = () => {
    updateBoard(boardId, boardName);
    onCancel();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      id="update-board-modal"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View>
            <Text>
              Name of your board
              <Text style={styles.labelMandatory}> *</Text>
            </Text>
            <TextInput
            id="board-name-input"
              style={styles.input}
              value={boardName}
              onChangeText={setBoardName}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.updateButton]}
              onPress={onSubmit}
              id="submit-update-board"
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent #0e0e0f background
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 10,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  updateButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
  },
  input: {
    height: 40,
    margin: 12,
    width: 200,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    borderColor: "black",
  },
  inputDescription: {
    height: 100,
    margin: 12,
    width: 200,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    borderColor: "black",
  },

  labelMandatory: {
    color: "red",
  },
});
