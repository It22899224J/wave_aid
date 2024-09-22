import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/service/firebase";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Text,
  TextInput,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface formData {
  email?: string | undefined;
  password?: string | undefined;
}

const SignIn = () => {
  const [formData, setFormData] = useState<formData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigation();
  const { signIn } = useAuth();

  const signin = async () => {
    setLoading(true);
    try {
      if (formData.email == "") {
        throw Error("Please Enter an Email");
      }
      if (formData.password == "") {
        throw Error("Please Enter a Password");
      }
      if (formData.email && formData.password) {
        signIn(formData.email, formData.password);
      }
    } catch (err: any) {
      console.log("Error in signup: " + err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    // Show loading spinner while checking user authentication state
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <SafeAreaView>
        <View style={style.view}>
          <KeyboardAvoidingView behavior="padding">
            {loading && <Text>Loading...</Text>}
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
            <Button title="Sign Up" onPress={signin} />
          </KeyboardAvoidingView>
          <TouchableOpacity onPress={() => navigate.navigate("signup" as never)}>
            <Text style={{ color: "#888", marginTop: 20 }}>
              Don't have an account? Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default SignIn;

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
