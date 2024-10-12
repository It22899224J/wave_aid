import Loader from "@/components/loader/Loader";
import { auth } from "@/service/firebase";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { createContext, FC, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

interface AuthContextData {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user as FirebaseAuthTypes.User | null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log("User:", user);
  }, [user]);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
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
      Alert.alert("Sign Up Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
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
        case "auth/invalid-credential":
          error.message = "Invalid Credentails. Please try again later.";
          break;
      }
      Alert.alert("Sign In Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await auth.signOut();
    } catch (error: any) {
      Alert.alert("Sign Out Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
