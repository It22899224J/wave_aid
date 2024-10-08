import Loader from "@/components/loader/Loader";
import { useAllUser, User } from "@/context/AllUserContext";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/service/firebase";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Pressable,
  Alert,
  ImageBackground,
  StatusBar,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const images = [
  require("../../assets/images/profile-bg-1.jpg"),
  require("../../assets/images/profile-bg-2.jpg"),
  require("../../assets/images/profile-bg-3.jpg"),
  require("../../assets/images/profile-bg-4.jpg"),
  require("../../assets/images/profile-bg-5.jpg"),
];

const Profile = () => {
  const { signOut, user, loading: authLoading } = useAuth();
  const { users, loading: allUserLoading } = useAllUser();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<User | undefined>(undefined);
  const [backgroundImage, setBackgroundImage] = useState(undefined);

  const deleteProfile = async () => {
    if (user) {
      setLoading(true);
      try {
        const userCollection = collection(db, "users");
        const q = query(userCollection, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docSnapshot) => {
          await deleteDoc(doc(db, "users", docSnapshot.id));
        });
        await user.delete();
        await signOut();
        Alert.alert("Success", "Account deleted successfully!");
      } catch (error) {
        console.error("Error deleting user account:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    }
  };

  const onClickDeleteProfile = () => {
    Alert.alert(
      "Delete Account",
      `Are you sure you want to delete your account? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: deleteProfile, style: "destructive" },
      ]
    );
  };

  const initializeUserDetails = useCallback(() => {
    if (!allUserLoading && !authLoading && users && user) {
      return users.find((userDoc) => userDoc.userId === user.uid);
    }
    return undefined;
  }, [allUserLoading, authLoading, users, user]);

  useEffect(() => {
    setUserDetails(initializeUserDetails());
    const randomIndex = Math.floor(Math.random() * 5);
    setBackgroundImage(images[randomIndex]);
  }, [initializeUserDetails]);

  if (loading) return <Loader />;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={backgroundImage} style={styles.headerBackground}>
        <View style={styles.headerOverlay} />
      </ImageBackground>

      <View style={styles.profileContent}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Ionicons name="person-circle" size={100} color="#2196F3" />
          </View>
        </View>

        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>{userDetails?.name}</Text>
          <Text style={styles.userEmail}>{userDetails?.email}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>128</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1.2k</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>470</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.editButton} onPress={() => {}}>
            <Ionicons name="create-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </Pressable>

          <Pressable
            style={styles.signOutButton}
            onPress={() => {
              Alert.alert("Sign Out", "Are you sure you want to sign out?", [
                { text: "Cancel", style: "cancel" },
                { text: "Sign Out", onPress: signOut, style: "destructive" },
              ]);
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Sign Out</Text>
          </Pressable>

          <Pressable style={styles.deleteButton} onPress={onClickDeleteProfile}>
            <Ionicons name="trash-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Delete Account</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  headerBackground: {
    height: 200,
    width: "100%",
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  profileContent: {
    flex: 1,
    marginTop: -60,
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfoContainer: {
    alignItems: "center",
    marginTop: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 30,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2196F3",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#E0E0E0",
  },
  buttonContainer: {
    padding: 20,
    gap: 10,
  },
  editButton: {
    backgroundColor: "#2196F3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  signOutButton: {
    backgroundColor: "#757575",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Profile;
