import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import SelectDropdown from "react-native-select-dropdown";
import axios from "axios";
import { useAllUser } from "@/context/AllUserContext";

// Mocking these imports/components for this example
const Loader = () => <Text>Loading...</Text>;

const roles = [{ title: "Admin" }, { title: "User" }];
const { width } = Dimensions.get("window");

const AdminUpdateUser = ({ route }) => {
  const { userId } = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const { users } = useAllUser();
  const [formData, setFormData] = useState({
    userId: "",
    email: "",
    name: "",
    role: "User",
    contactNo: "",
  });

  useEffect(() => {
    setFormData(
      users?.find((user) => user.userId === userId) || {
        email: "",
        name: "",
        role: "User",
        userId: "",
        contactNo: "",
      }
    );
    setLoading(false);
  }, [users, userId]);

  const updateProfile = async (userId: string) => {
    if (userId) {
      setLoading(true);

      try {
        await axios.put(
          `http://192.168.1.5:3000/adminUser/update-user/${userId}`,
          formData
        );
        navigation.navigate("Admin All User Dashboard" as never);
        Alert.alert("User updated successfully!");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          Alert.alert(
            "Failed to update user",
            `${error.response?.data.error || "An unexpected error occurred"}`
          );
        } else {
          console.error("An unexpected error occurred:", error);
          Alert.alert("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>Update User</Text>
          <View style={styles.inputContainer}>
            <Icon
              name="mail-outline"
              size={24}
              color="#007AFF"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prevData) => ({ ...prevData, email: text }))
              }
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon
              name="person-outline"
              size={24}
              color="#007AFF"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={formData.name}
              onChangeText={(text) =>
                setFormData((prevData) => ({ ...prevData, name: text }))
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon
              name="call-outline"
              size={24}
              color="#007AFF"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact No"
              value={formData.contactNo}
              onChangeText={(text) =>
                setFormData((prevData) => ({ ...prevData, contactNo: text }))
              }
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputContainer}>
            <SelectDropdown
              data={roles}
              onSelect={(selectedItem) => {
                setFormData((prevData) => ({
                  ...prevData,
                  role: selectedItem.title,
                }));
              }}
              defaultValue={roles.find((role) => role.title === formData.role)}
              dropdownStyle={styles.dropdown}
              renderButton={renderButton}
              renderItem={renderItem}
            />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updateProfile(formData.userId)}
          >
            <Text style={styles.submitButtonText}>Update User</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const renderButton = (selectedItem, isOpened) => {
  return (
    <View style={styles.buttonContainer}>
      <Icon
        name="people-outline"
        size={24}
        color="#007AFF"
        style={styles.icon}
      />
      <Text style={styles.buttonText}>
        {selectedItem ? selectedItem.title : "Select user role"}
      </Text>
      <Icon
        name={isOpened ? "chevron-up" : "chevron-down"}
        color="#007AFF"
        size={18}
        style={styles.dropdownIcon}
      />
    </View>
  );
};

const renderItem = (item, index) => {
  return (
    <View style={styles.dropdownItemContainer}>
      <Icon
        name={item.title === "Admin" ? "shield-outline" : "person-outline"}
        size={20}
        color="#007AFF"
        style={styles.itemIcon}
      />
      <Text style={styles.dropdownItemText}>{item.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#333",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonText: {
    color: "#000",
    // fontSize: 18,
    // fontWeight: "bold",
    flex: 1,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  dropdown: {
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dropdownIcon: {
    marginLeft: 10,
  },
  dropdownItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 1,
  },
  itemIcon: {
    marginRight: 10,
  },
  dropdownItemText: {
    color: "#333",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    flex: 1,
  },
});

export default AdminUpdateUser;
