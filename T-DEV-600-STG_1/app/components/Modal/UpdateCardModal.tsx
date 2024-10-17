import { User } from "@/types";
import React, { useState } from "react";
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface UpdateCardModalProps {
  visible: boolean;
  onCancel: () => void;
  onRefresh: (card: Card) => void;
  workspaceMembers: User[];
  initialCard: Card;
}

export interface Card {
  name: string;
  desc: string;
  idMembers?: string[];
}

export const UpdateCardModal: React.FC<UpdateCardModalProps> = (
  props: UpdateCardModalProps
) => {
  const { visible, onCancel, workspaceMembers, onRefresh, initialCard } = props;

  const [card, setCard] = useState<Card>(initialCard);
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<string[]>(
    workspaceMembers
      .filter((member) => initialCard.idMembers?.includes(member.id))
      .map((member) => member.id) || []
  );


  const handleChanges = (key: string, value: string) => {
    setCard((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onSubmit = () => {
    onRefresh({ ...card, idMembers: members });
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
            <Text style={{ marginTop: 12 }}>Name:</Text>
            <TextInput
              style={styles.input}
              value={card.name}
              onChangeText={(text) => handleChanges("name", text)}
              placeholder="Enter description"
            />

            <Text style={{ marginTop: 12 }}>Description:</Text>
            <TextInput
              value={card.desc}
              style={styles.input}
              onChangeText={(text) => handleChanges("desc", text)}
              placeholder="Enter description"
            />

            <Text style={{ marginTop: 12 }}>Members</Text>
            <DropDownPicker
              style={{ marginTop: 6 }}
              open={open}
              value={members}
              multiple
              items={workspaceMembers.map((member) => ({
                label: member.fullName,
                value: member.id,
              }))}
              setOpen={setOpen}
              setValue={setMembers}
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
    marginTop: 30,
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
    width: 200,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 6,
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
