import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db, auth } from "@/service/firebase";
import { User } from "@/context/AllUserContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@/context/AuthContext";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Loader from "@/components/loader/Loader";
import { updateEmail, updatePassword } from "firebase/auth";

const ProfileUpdate: React.FC = () => {
  const navigation = useNavigation();

  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    email: "",
    contactNo: "",
    role: "",
  });

  useEffect(() => {
    const getUserDetails = async () => {
      if (user) {
        try {
          const userCollection = collection(db, "users");
          const q = query(userCollection, where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach(async (docSnapshot) => {
            const { userId, name, email, role, contactNo } = docSnapshot.data();
            setFormData({
              userId,
              name,
              email,
              role,
              contactNo,
            });
          });
        } catch (error) {
          console.log("Error fetch user account:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    getUserDetails();
  }, [user]);

  const [password, setPassword] = useState("");

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("No authenticated user found");
      }

      // Update Authentication email if changed
      if (formData.email !== user.email) {
        await updateEmail(user, formData.email);
      }

      // Update password if provided
      if (password) {
        await updatePassword(user, password);
      }

      // Update Firestore document
      const userCollection = collection(db, "users");
      const q = query(userCollection, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (docSnapshot) => {
        const docRef = doc(userCollection, docSnapshot.id);
        await updateDoc(docRef, {
          contactNo: formData.contactNo,
          email: formData.email,
          name: formData.name,
          role: formData.role,
        });
      });

      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.log("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) return <Loader />;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Update Profile</Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={24}
            color="#007AFF"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(value) => handleInputChange("name", value)}
            placeholder="Name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={24}
            color="#007AFF"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            readOnly
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="call-outline"
            size={24}
            color="#007AFF"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            value={formData.contactNo}
            onChangeText={(value) => handleInputChange("contactNo", value)}
            placeholder="Contact Number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={24}
            color="#007AFF"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="New Password (optional)"
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.updateButton} onPress={updateProfile}>
          <Text style={styles.updateButtonText}>Update Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollViewContent: {
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
  updateButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileUpdate;
