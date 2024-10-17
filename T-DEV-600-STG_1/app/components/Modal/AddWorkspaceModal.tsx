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

interface AddModalProps {
  visible: boolean;
  onCancel: () => void;
  onRefresh: () => void;
}
interface Workspace {
  displayName: string;
  desc?: string;
}

export const AddModal: React.FC<AddModalProps> = (props: AddModalProps) => {
  const { visible, onCancel, onRefresh } = props;

  const [workspaceInput, onChangeWorkspaceInput] = useState<Workspace>({
    displayName: "",
  });

  const onChangeName = (text: string) => {
    onChangeWorkspaceInput({ ...workspaceInput, displayName: text });
  };

  const onChangeDesc = (text: string) => {
    onChangeWorkspaceInput({ ...workspaceInput, desc: text });
  };

  const addWorkspace = (workspace: Workspace) => {
    Trello.createWorkspace(workspace).then((res) => {
      onRefresh();
    });
  };

  const onSubmit = () => {
    addWorkspace(workspaceInput);
    onCancel();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View>
            <Text>
              Name of your workspace
              <Text style={styles.labelMandatory}> *</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={workspaceInput?.displayName}
              onChangeText={onChangeName}
            />
            <Text>Description</Text>
            <TextInput
              style={styles.inputDescription}
              value={workspaceInput?.desc}
              onChangeText={onChangeDesc}
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
