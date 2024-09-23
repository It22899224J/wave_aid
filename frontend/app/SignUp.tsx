import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../service/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "@/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import Loader from "@/components/loader/Loader";

interface formData {
  username?: string | undefined;
  role?: string | undefined;
  email?: string | undefined;
  password?: string | undefined;
}

const SignUp = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState<formData>({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigation();

  const signup = async () => {
    setLoading(true);
    try {
      if (formData.username == "") {
        throw Error("Please Enter a Username");
      }
      if (formData.email == "") {
        throw Error("Please Enter an Email");
      }
      if (formData.password == "") {
        throw Error("Please Enter a Password");
      }
      if (formData.role == "") {
        throw Error("Please Enter a Role");
      }
      if (formData.email && formData.password) {
        const user = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        addDoc(collection(db, "users"), {
          userId: user.user.uid,
          name: formData.username,
          email: formData.email,
          role: formData.role,
        });
      }
    } catch (error: any) {
      console.log("Error in signup: " + error);
      switch (error.code) {
        case "auth/email-already-in-use":
          error.message = "Email already in use";
          break;
        case "auth/invalid-email":
          error.message = "Invalid email";
          break;
        case "auth/missing-password":
          error.message = "Missing password";
          break;
        case "auth/weak-password":
          error.message = "Password is too weak";
          break;
        case "auth/too-many-requests":
          error.message = "Too many requests. Please try again later.";
          break;
      }
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    // Show loading spinner while checking user authentication state
    return <Loader />;
  }

  return (
    <SafeAreaView>
      <View style={style.view}>
        <KeyboardAvoidingView behavior="padding">
          {loading && <Text>Loading...</Text>}
          <Text>Username</Text>
          <TextInput
            style={style.textInput}
            value={formData.username}
            onChangeText={(e) =>
              setFormData((existingFormData) => ({
                ...existingFormData,
                username: e,
              }))
            }
          />
          <Text>Email</Text>
          <TextInput
            style={style.textInput}
            value={formData.email}
            onChangeText={(e) =>
              setFormData((existingFormData) => ({
                ...existingFormData,
                email: e,
              }))
            }
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Text>Password</Text>
          <TextInput
            style={style.textInput}
            value={formData.password}
            onChangeText={(e) => {
              setFormData((existingFormData) => ({
                ...existingFormData,
                password: e,
              }));
            }}
            secureTextEntry
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
              <View style={style.dropdownButtonStyle}>
                {selectedItem && (
                  <Icon
                    name={selectedItem.icon}
                    style={style.dropdownButtonIconStyle}
                  />
                )}
                <Text style={style.dropdownButtonTxtStyle}>
                  {(selectedItem && selectedItem.title) || "Select user role"}
                </Text>
                <Icon
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  style={style.dropdownButtonArrowStyle}
                />
              </View>
            )}
            renderItem={(item, index, isSelected) => {
              return (
                <View
                  style={{
                    ...style.dropdownItemStyle,
                    ...(isSelected && { backgroundColor: "#D2D9DF" }),
                  }}
                >
                  <Icon name={item.icon} style={style.dropdownItemIconStyle} />
                  <Text style={style.dropdownItemTxtStyle}>{item.title}</Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={style.dropdownMenuStyle}
          />
          <Button title="Sign Up" onPress={signup} />
        </KeyboardAvoidingView>
        <TouchableOpacity onPress={() => navigate.navigate("signin" as never)}>
          <Text style={{ color: "#888", marginTop: 20 }}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;

const style = StyleSheet.create({
  view: {
    height: "95%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    width: 300,
    marginBottom: 50,
    borderBottomColor: "#aaa",
    borderBottomWidth: 1,
  },
  dropdownButtonStyle: {
    width: 300,
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
