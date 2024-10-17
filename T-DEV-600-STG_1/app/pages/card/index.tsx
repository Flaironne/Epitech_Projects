import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

import { Header } from "@/components";

const CardPage = () => {
  const { cardName } = useLocalSearchParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedPeople, setAssignedPeople] = useState("");
  const [labels, setLabels] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    typeof cardName == "string" && setTitle(cardName);
  }, []);

  const handleSave = () => {
    // Implement your save logic here
    console.log("Card details saved!");
  };

  return (
    <View>
      <Header title={title} />
      <View style={styles.container}>
        <Text>Description:</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
        />

        <Text>Assigned People:</Text>
        <TextInput
          value={assignedPeople}
          onChangeText={setAssignedPeople}
          placeholder="Enter assigned people"
        />

        <Text>Labels:</Text>
        <TextInput
          value={labels}
          onChangeText={setLabels}
          placeholder="Enter labels"
        />

        <Text>Start Date:</Text>
        <TextInput
          value={startDate}
          onChangeText={setStartDate}
          placeholder="Enter start date"
        />

        <Text>Due Date:</Text>
        <TextInput
          value={dueDate}
          onChangeText={setDueDate}
          placeholder="Enter due date"
        />

        <Button title="Save" onPress={handleSave} />
      </View>
    </View>
  );
};

export default CardPage;

const styles = {
  container: {
    padding: 20,
  },
};
