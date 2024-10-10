import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const EventCompletionForm = () => {
  const [formData, setFormData] = useState({
    totalParticipants: "",
    newParticipants: "",
    wasteCollected: "",
    wasteTypes: [],
    busUsers: "",
    otherTransportMethods: [],
    busFuelConsumption: "",
  });

  const [currentWasteType, setCurrentWasteType] = useState("");
  const [currentTransportMethod, setCurrentTransportMethod] = useState("");

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addWasteType = () => {
    if (currentWasteType.trim() !== "") {
      setFormData((prevState) => ({
        ...prevState,
        wasteTypes: [...prevState.wasteTypes, currentWasteType.trim()],
      }));
      setCurrentWasteType("");
    }
  };

  const addTransportMethod = () => {
    if (currentTransportMethod.trim() !== "") {
      setFormData((prevState) => ({
        ...prevState,
        otherTransportMethods: [
          ...prevState.otherTransportMethods,
          currentTransportMethod.trim(),
        ],
      }));
      setCurrentTransportMethod("");
    }
  };

  const handleSubmit = async () => {
    try {

      //TODO make the firebase create record
      
      Alert.alert("Success", "Event completion data submitted successfully!");
      // Reset form or navigate away
    } catch (error) {
      console.error("Error submitting data:", error);
      Alert.alert(
        "Error",
        "Failed to submit event completion data. Please try again."
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Event Completion Form</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Total Participants</Text>
        <TextInput
          style={styles.input}
          value={formData.totalParticipants}
          onChangeText={(value) =>
            handleInputChange("totalParticipants", value)
          }
          keyboardType="numeric"
          placeholder="Enter total participants"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Participants</Text>
        <TextInput
          style={styles.input}
          value={formData.newParticipants}
          onChangeText={(value) => handleInputChange("newParticipants", value)}
          keyboardType="numeric"
          placeholder="Enter new participants"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Waste Collected (kg)</Text>
        <TextInput
          style={styles.input}
          value={formData.wasteCollected}
          onChangeText={(value) => handleInputChange("wasteCollected", value)}
          keyboardType="numeric"
          placeholder="Enter amount of waste collected"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Waste Types</Text>
        <View style={styles.rowContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={currentWasteType}
            onChangeText={setCurrentWasteType}
            placeholder="Enter waste type"
          />
          <TouchableOpacity style={styles.addButton} onPress={addWasteType}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
        {formData.wasteTypes.map((type, index) => (
          <Text key={index} style={styles.listItem}>
            {type}
          </Text>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Bus Users</Text>
        <TextInput
          style={styles.input}
          value={formData.busUsers}
          onChangeText={(value) => handleInputChange("busUsers", value)}
          keyboardType="numeric"
          placeholder="Enter number of bus users"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Other Transport Methods</Text>
        <View style={styles.rowContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={currentTransportMethod}
            onChangeText={setCurrentTransportMethod}
            placeholder="Enter transport method"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={addTransportMethod}
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
        {formData.otherTransportMethods.map((method, index) => (
          <Text key={index} style={styles.listItem}>
            {method}
          </Text>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Bus Fuel Consumption (liters)</Text>
        <TextInput
          style={styles.input}
          value={formData.busFuelConsumption}
          onChangeText={(value) =>
            handleInputChange("busFuelConsumption", value)
          }
          keyboardType="numeric"
          placeholder="Enter bus fuel consumption"
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginVertical: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  listItem: {
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginTop: 5,
  },
});

export default EventCompletionForm;
