import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { User } from "@/context/AllUserContext";
import SelectDropdown from "react-native-select-dropdown";
import Loader from "@/components/loader/Loader";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
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

  if (loading) return <Loader />;

  const onSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://192.168.1.5:3000/adminUser/create-user",
        {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: formData.role,
          contactNo: formData.contactNo,
        }
      );
      console.log(response.data);
      console.log("User created successfully");
      navigation.navigate("Admin All User" as never);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Axios-specific error handling
        Alert.alert(
          "Failed to update user",
          `${error.response?.data.error || "An unexpected error occurred"}`
        );
      } else {
        // Non-Axios errors
        console.error("An unexpected error occurred:", error);
        Alert.alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.view}>
        <Text>Email</Text>
        <TextInput
          style={styles.textInput}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
        />
        <Text>Password</Text>
        <TextInput
          style={styles.textInput}
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          keyboardType="default"
          secureTextEntry={true}
        />
        <Text>Name</Text>
        <TextInput
          style={styles.textInput}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          keyboardType="default"
        />
        <Text>Contact No</Text>
        <TextInput
          style={styles.textInput}
          value={formData.contactNo}
          onChangeText={(text) => setFormData({ ...formData, contactNo: text })}
          keyboardType="numeric"
        />
        <SelectDropdown
          data={[
            { title: "Admin" },
            { title: "User" },
            // { title: "Option 3" },
          ]}
          onSelect={(e) => {
            setFormData((existingFormData) => ({
              ...existingFormData,
              role: e.title,
            }));
          }}
          renderButton={(selectedItem, isOpened) => (
            <View style={styles.dropdownButtonStyle}>
              {selectedItem && (
                <Icon
                  name={selectedItem.icon}
                  style={styles.dropdownButtonIconStyle}
                />
              )}
              <Text style={styles.dropdownButtonTxtStyle}>
                {(selectedItem && selectedItem.title) || "Select user role"}
              </Text>
              <Icon
                name={isOpened ? "chevron-up" : "chevron-down"}
                style={styles.dropdownButtonArrowStyle}
              />
            </View>
          )}
          renderItem={(item, index, isSelected) => {
            return (
              <View
                style={{
                  ...styles.dropdownItemStyle,
                  ...(isSelected && { backgroundColor: "#D2D9DF" }),
                }}
              >
                <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />

        <Button title="Create User" onPress={onSubmit} />
      </View>
    </SafeAreaView>
  );
};

export default AdminCreateUser;

const styles = StyleSheet.create({
  view: {
    height: "95%",
    // width: "100%",
    display: "flex",
    marginVertical: 20,
    marginHorizontal: 20,
  },
  textInput: {
    // width: 300,
    marginBottom: 50,
    borderBottomColor: "#aaa",
    borderBottomWidth: 1,
  },
  dropdownButtonStyle: {
    // width: 300,
    height: 50,
    marginBottom: 35,
    backgroundColor: "#DDD",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 23,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
