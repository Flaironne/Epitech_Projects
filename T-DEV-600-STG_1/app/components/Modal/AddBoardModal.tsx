import React, { useEffect, useState } from "react";
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
} from "react-native";
import { Trello } from "../../api/trello";
import DropDownPicker from "react-native-dropdown-picker";

interface AddModalProps {
  visible: boolean;
  workspaceId: string;
  onCancel: () => void;
  onRefresh: () => void;
}

const templateList = [
  { label: "Productivity", value: "5673286460eb65ac8b4a8c7d" },
  { label: "Business", value: "5ea1afd72cbb1f716cf2b9cd" },
  { label: "Education", value: "566f021b04239fa9071235e3" },
];

export const AddBoardModal: React.FC<AddModalProps> = (
  props: AddModalProps
) => {
  const { visible, onCancel, onRefresh, workspaceId } = props;

  const [manualBoardMode, setManualBoardMode] = useState<boolean>(false);
  const [templateBoardMode, setTemplateBoardMode] = useState<boolean>(false);
  const [boardInput, onChangeBoardInput] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [templateChoice, setTemplateChoice] = useState(
    "5673286460eb65ac8b4a8c7d"
  );

  const onChangeName = (boardName: string) => {
    onChangeBoardInput(boardName);
  };

  const addBoard = (boardName: string) => {
    Trello.createBoard({ name: boardName, idOrganization: workspaceId }).then(
      (res) => {
        onRefresh();
      }
    );
  };

  const addTemplateBoard = (template: Record<string, any>) => {
    Trello.createBoard(template).then((res) => {
      onRefresh();
    });
  };

  const onSubmit = () => {
    if (manualBoardMode) {
      addBoard(boardInput);
    }
    if (templateBoardMode) {
      const tampTemplateBoard = {
        name:
          templateList.find((template) => template.value === templateChoice)
            ?.label || "RANDOMNAME",
        idBoardSource: templateChoice,
        idOrganization: workspaceId,
        keepFromSource: "none",
      };

      addTemplateBoard(tampTemplateBoard);
    }
    onCancel();
  };

  useEffect(() => {
    return () => {
      setManualBoardMode(false);
      setTemplateBoardMode(false);
    };
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView} id="add-board-modal">
        <View style={styles.modalView}>
          {!manualBoardMode && !templateBoardMode && (
            <View>
              <Text>Choose your way to add a Board</Text>
              <View style={styles.buttonContainer} id="button-container">
                <Button
                  title="Manual"
                  onPress={() => setManualBoardMode(true)}
                />
                <Button
                  testID="template-button"
                  title="Template"
                  onPress={() => setTemplateBoardMode(true)}
                />
              </View>
            </View>
          )}
          {manualBoardMode && (
            <View>
              <Text>
                Name of your Board
                <Text style={styles.labelMandatory}> *</Text>
              </Text>
              <TextInput
                id="board-name-input"
                style={styles.input}
                value={boardInput}
                onChangeText={onChangeName}
              />
            </View>
          )}
          {templateBoardMode && (
            <View id="template-board-mode">
              <Text>
                Choose a template
                <Text style={styles.labelMandatory}> *</Text>
              </Text>
              <DropDownPicker
                open={open}
                value={templateChoice}
                items={templateList}
                setOpen={setOpen}
                setValue={setTemplateChoice}
              />
            </View>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              id="submit-create-board"
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
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
