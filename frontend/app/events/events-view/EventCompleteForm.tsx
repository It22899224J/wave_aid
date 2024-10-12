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
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/service/firebase";
import { useNavigation } from "@react-navigation/native";
import Loader from "@/components/loader/Loader";

const ExpandedEventCompletionForm = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Event Summary
    eventName: "",
    wasteCollected: "",
    areaCovered: "",

    // Waste Composition
    wasteTypes: [],
    commonWasteItems: [],

    // Transport Efficiency
    busUsers: "",
    busFuelConsumption: "",
    transportCost: "",
    otherTransportMethods: [],

    // Volunteer Engagement
    attendanceRate: "",
    recurringVolunteers: "",
    newVolunteers: "",
    hoursContributed: "",
    satisfactionRating: "",

    // Performance Metrics
    wastePerHour: "",

    // Environmental Impact
    wildlifeCount: "",
    pollutionLevel: "",
    biodiversityScore: "",
    waterQualityScore: "",
    soilHealthScore: "",
    airQualityScore: "",
    habitatRestorationScore: "",

    // Additional Details
    notes: "",
  });

  const [currentWasteType, setCurrentWasteType] = useState({
    type: "",
    percentage: "",
  });
  const [currentWasteItem, setCurrentWasteItem] = useState({
    item: "",
    count: "",
  });
  const [currentTransportMethod, setCurrentTransportMethod] = useState("");

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addWasteType = () => {
    if (
      currentWasteType.type.trim() !== "" &&
      currentWasteType.percentage.trim() !== ""
    ) {
      setFormData((prevState: any) => ({
        ...prevState,
        wasteTypes: [
          ...prevState.wasteTypes,
          { ...currentWasteType, color: getRandomColor() },
        ],
      }));
      setCurrentWasteType({ type: "", percentage: "" });
    }
  };

  const addCommonWasteItem = () => {
    if (
      currentWasteItem.item.trim() !== "" &&
      currentWasteItem.count.trim() !== ""
    ) {
      setFormData((prevState: any) => ({
        ...prevState,
        commonWasteItems: [...prevState.commonWasteItems, currentWasteItem],
      }));
      setCurrentWasteItem({ item: "", count: "" });
    }
  };

  const addTransportMethod = () => {
    if (currentTransportMethod.trim() !== "") {
      setFormData((prevState: any) => ({
        ...prevState,
        otherTransportMethods: [
          ...prevState.otherTransportMethods,
          currentTransportMethod.trim(),
        ],
      }));
      setCurrentTransportMethod("");
    }
  };

  const getRandomColor = () => {
    return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, 1)`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const completionData = {
        ...formData,
        // userId: user ? user.uid : null,
        // eventId: eventDetails.id,
        date: new Date().toISOString(),
        status: "completed",
        totalParticipants:
          Number(formData.newVolunteers) + Number(formData.recurringVolunteers),
      };

      await addDoc(collection(db, "eventCompletions"), completionData);

      Alert.alert("Success", "Event completion data submitted successfully!");
      // Reset form or navigate away
      resetForm();
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting data:", error);
      Alert.alert(
        "Error",
        "Failed to submit event completion data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      // Reset all form fields to their initial state
      eventName: "",
      wasteCollected: "",
      areaCovered: "",
      wasteTypes: [],
      commonWasteItems: [],
      busUsers: "",
      busFuelConsumption: "",
      transportCost: "",
      otherTransportMethods: [],
      attendanceRate: "",
      recurringVolunteers: "",
      newVolunteers: "",
      hoursContributed: "",
      satisfactionRating: "",
      wastePerHour: "",
      wildlifeCount: "",
      pollutionLevel: "",
      biodiversityScore: "",
      waterQualityScore: "",
      soilHealthScore: "",
      airQualityScore: "",
      habitatRestorationScore: "",
      notes: "",
    });
    setCurrentWasteType({ type: "", percentage: "" });
    setCurrentWasteItem({ item: "", count: "" });
    setCurrentTransportMethod("");
  };

  if (loading) return <Loader />;

  return (
    <ScrollView style={styles.container}>
      {/* Event Summary Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Event Summary</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Total Participants</Text>
          <TextInput
            style={styles.input}
            value={formData.eventName}
            onChangeText={(value) => handleInputChange("eventName", value)}
            keyboardType="numeric"
            placeholder="Enter total participants"
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
          <Text style={styles.label}>Area Covered (m²)</Text>
          <TextInput
            style={styles.input}
            value={formData.areaCovered}
            onChangeText={(value) => handleInputChange("areaCovered", value)}
            keyboardType="numeric"
            placeholder="Enter area covered"
          />
        </View>
      </View>

      {/* Waste Composition Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Waste Composition</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Waste Types</Text>
          <View style={styles.rowContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 10 }]}
              value={currentWasteType.type}
              onChangeText={(value) =>
                setCurrentWasteType((prev) => ({ ...prev, type: value }))
              }
              placeholder="Waste type"
            />
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 10 }]}
              value={currentWasteType.percentage}
              onChangeText={(value) =>
                setCurrentWasteType((prev) => ({ ...prev, percentage: value }))
              }
              keyboardType="numeric"
              placeholder="Percentage"
            />
            <TouchableOpacity style={styles.addButton} onPress={addWasteType}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
          {formData.wasteTypes.map((type: any, index: number) => (
            <Text key={index} style={styles.listItem}>
              {type.type}: {type.percentage}%
            </Text>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Common Waste Items</Text>
          <View style={styles.rowContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 10 }]}
              value={currentWasteItem.item}
              onChangeText={(value) =>
                setCurrentWasteItem((prev) => ({ ...prev, item: value }))
              }
              placeholder="Item name"
            />
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 10 }]}
              value={currentWasteItem.count}
              onChangeText={(value) =>
                setCurrentWasteItem((prev) => ({ ...prev, count: value }))
              }
              keyboardType="numeric"
              placeholder="Count"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={addCommonWasteItem}
            >
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
          {formData.commonWasteItems.map((item: any, index: number) => (
            <Text key={index} style={styles.listItem}>
              {item.item}: {item.count}
            </Text>
          ))}
        </View>
      </View>

      {/* Transport Efficiency Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transport Efficiency</Text>
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

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Transport Cost</Text>
          <TextInput
            style={styles.input}
            value={formData.transportCost}
            onChangeText={(value) => handleInputChange("transportCost", value)}
            keyboardType="numeric"
            placeholder="Enter transport cost"
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
      </View>

      {/* Volunteer Engagement Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Volunteer Engagement</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Attendance Rate (%)</Text>
          <TextInput
            style={styles.input}
            value={formData.attendanceRate}
            onChangeText={(value) => handleInputChange("attendanceRate", value)}
            keyboardType="numeric"
            placeholder="Enter attendance rate"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Recurring Volunteers</Text>
          <TextInput
            style={styles.input}
            value={formData.recurringVolunteers}
            onChangeText={(value) =>
              handleInputChange("recurringVolunteers", value)
            }
            keyboardType="numeric"
            placeholder="Enter number of recurring volunteers"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Volunteers</Text>
          <TextInput
            style={styles.input}
            value={formData.newVolunteers}
            onChangeText={(value) => handleInputChange("newVolunteers", value)}
            keyboardType="numeric"
            placeholder="Enter number of new volunteers"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Hours Contributed</Text>
          <TextInput
            style={styles.input}
            value={formData.hoursContributed}
            onChangeText={(value) =>
              handleInputChange("hoursContributed", value)
            }
            keyboardType="numeric"
            placeholder="Enter total hours contributed"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Satisfaction Rating (1-5)</Text>
          <TextInput
            style={styles.input}
            value={formData.satisfactionRating}
            onChangeText={(value) =>
              handleInputChange("satisfactionRating", value)
            }
            keyboardType="numeric"
            placeholder="Enter satisfaction rating"
          />
        </View>
      </View>

      {/* Performance Metrics Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Waste Collected Per Hour (kg/hr)</Text>
          <TextInput
            style={styles.input}
            value={formData.wastePerHour}
            onChangeText={(value) => handleInputChange("wastePerHour", value)}
            keyboardType="numeric"
            placeholder="Enter waste collected per hour"
          />
        </View>
      </View>

      {/* Environmental Impact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Environmental Impact</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Wildlife Count</Text>
          <TextInput
            style={styles.input}
            value={formData.wildlifeCount}
            onChangeText={(value) => handleInputChange("wildlifeCount", value)}
            keyboardType="numeric"
            placeholder="Enter wildlife count"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Pollution Level (1-100)</Text>
          <TextInput
            style={styles.input}
            value={formData.pollutionLevel}
            onChangeText={(value) => handleInputChange("pollutionLevel", value)}
            keyboardType="numeric"
            placeholder="Enter pollution level"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Biodiversity Score (0-1)</Text>
          <TextInput
            style={styles.input}
            value={formData.biodiversityScore}
            onChangeText={(value) =>
              handleInputChange("biodiversityScore", value)
            }
            keyboardType="numeric"
            placeholder="Enter biodiversity score"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Water Quality Score (0-1)</Text>
          <TextInput
            style={styles.input}
            value={formData.waterQualityScore}
            onChangeText={(value) =>
              handleInputChange("waterQualityScore", value)
            }
            keyboardType="numeric"
            placeholder="Enter water quality score"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Soil Health Score (0-1)</Text>
          <TextInput
            style={styles.input}
            value={formData.soilHealthScore}
            onChangeText={(value) =>
              handleInputChange("soilHealthScore", value)
            }
            keyboardType="numeric"
            placeholder="Enter soil health score"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Air Quality Score (0-1)</Text>
          <TextInput
            style={styles.input}
            value={formData.airQualityScore}
            onChangeText={(value) =>
              handleInputChange("airQualityScore", value)
            }
            keyboardType="numeric"
            placeholder="Enter air quality score"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Habitat Restoration Score (0-1)</Text>
          <TextInput
            style={styles.input}
            value={formData.habitatRestorationScore}
            onChangeText={(value) =>
              handleInputChange("habitatRestorationScore", value)
            }
            keyboardType="numeric"
            placeholder="Enter habitat restoration score"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Details</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(value) => handleInputChange("notes", value)}
            placeholder="Enter any additional notes or observations"
            multiline
            numberOfLines={4}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
          <Text style={styles.buttonText}>Reset Form</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ExpandedEventCompletionForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  resetButton: {
    backgroundColor: "#f44336",
    padding: 12,
    borderRadius: 4,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#444",
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  listItem: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },
});
