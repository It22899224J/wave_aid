import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { User } from "@/context/AllUserContext";
import Loader from "@/components/loader/Loader";

const roles = [{ title: "Admin" }, { title: "User" }];
const { width } = Dimensions.get("window");

const AdminCreateUser = () => {
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    password: "",
    contactNo: "",
    role: "User",
  });
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const onSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://192.168.1.5:3000/adminUser/create-user",
        formData
      );
      console.log("User created successfully:", response.data);
      navigation.navigate("Admin All User Dashboard" as never);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert(
          "Failed to create user",
          `${error.response?.data.error || "An unexpected error occurred"}`
        );
      } else {
        console.error("An unexpected error occurred:", error);
        Alert.alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
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
          <Text style={styles.title}>Create New User</Text>
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
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>
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
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon
              name="lock-closed-outline"
              size={24}
              color="#007AFF"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
              secureTextEntry
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
                setFormData({ ...formData, contactNo: text })
              }
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputContainer}>
            <SelectDropdown
              data={roles}
              onSelect={(selectedItem, index) => {
                setFormData({ ...formData, role: selectedItem });
              }}
              dropdownStyle={styles.dropdown}
              renderButton={renderButton}
              renderItem={renderItem}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={onSubmit}>
            <Text style={styles.submitButtonText}>Create User</Text>
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
    width: "100%",
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
    color: "#333",
    // fontSize: 18,
    // fontWeight: "bold",
    flex: 1,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    // flex: 1,
  },

  dropdownButton: {
    width: "100%",
    height: 50,
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
  dropdownButtonText: {
    color: "#333",
    textAlign: "left",
  },
  dropdown: {
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dropdownRow: {
    backgroundColor: "#FFFFFF",
  },
  dropdownRowText: {
    color: "#333",
    textAlign: "left",
  },
  dropdownIcon: {
    marginLeft: 10,
  },
  dropdownItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
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
    width: "100%",
  },
});

export default AdminCreateUser;
