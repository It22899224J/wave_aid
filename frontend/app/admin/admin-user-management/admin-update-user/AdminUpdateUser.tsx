import { User } from "@/context/AllUserContext";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import SelectDropdown from "react-native-select-dropdown";
import Loader from "@/components/loader/Loader";
import { useAllUser } from "@/context/AllUserContext";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

const AdminUpdateUser = ({ route }: any) => {
  const { userId } = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const { users } = useAllUser();
  const [formData, setFormData] = useState<User | undefined>({
    email: "",
    name: "",
    role: "User",
    userId: "",
    contactNo: "",
  });

  useEffect(() => {
    setFormData(
      users?.find((user: User) => user.userId === userId) || undefined
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
          // Axios-specific error handling
          Alert.alert(
            "Failed to update user",
            `${
              error.response?.data.error || "An unexpected error occurred"
            }`
          );
        } else {
          // Non-Axios errors
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
    <SafeAreaView>
      <View style={styles.view}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.textInput}
          value={formData?.email}
          onChangeText={(text: string) =>
            setFormData((prevData) =>
              prevData ? { ...prevData, email: text } : undefined
            )
          }
          keyboardType="email-address"
        />
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.textInput}
          value={formData?.name}
          onChangeText={(text: string) =>
            setFormData((prevData) =>
              prevData ? { ...prevData, name: text } : undefined
            )
          }
          keyboardType="default"
        />
        <Text style={styles.label}>Contact No</Text>
        <TextInput
          style={styles.textInput}
          value={formData?.contactNo}
          onChangeText={(text: string) =>
            setFormData((prevData) =>
              prevData ? { ...prevData, contactNo: text } : undefined
            )
          }
          keyboardType="numeric"
        />
        <Text style={styles.label}>Role</Text>
        <SelectDropdown
          data={[
            { title: "Admin" },
            { title: "User" },
            // { title: "Option 3" },
          ]}
          onSelect={(e) => {
            setFormData((prevData) =>
              prevData ? { ...prevData, role: e.title } : undefined
            );
          }}
          defaultValueByIndex={formData?.role === "Admin" ? 0 : 1}
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
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => updateProfile(formData?.userId || "")}
        >
          <Text style={styles.updateButtonText}>Update User</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AdminUpdateUser;

const styles = StyleSheet.create({
  view: {
    height: "95%",
    // width: "100%",
    display: "flex",
    margin: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  updateButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
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
