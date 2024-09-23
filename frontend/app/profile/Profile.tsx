import Loader from "@/components/loader/Loader";
import { useAllUser, User } from "@/context/AllUserContext";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/service/firebase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { deleteDoc, doc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";

const Profile = () => {
  const { signOut, user, loading: authLoading } = useAuth();
  const { users, loading: allUserLoading } = useAllUser();
  const [loading, setLoading] = useState(false);

  const [userDetails, setUserDetails] = useState<User | undefined>(undefined);

  const deleteProfile = async () => {
    if (user) {
      setLoading(true);
      try {
        // Delete Firestore record
        await deleteDoc(doc(db, "users", user.uid));
        // Delete Firebase Authentication record
        await user.delete();
        // Sign out the user
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
      "Are you sure?",
      `User associated to ${user?.email} will be deleted`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => deleteProfile(),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  // Memoized function to find user details
  const initializeUserDetails = useCallback(() => {
    if (!allUserLoading && !authLoading && users && user) {
      const matchedUser = users.find((userDoc) => userDoc.userId === user.uid);
      return matchedUser;
    }
    return undefined;
  }, [allUserLoading, authLoading, users, user]);

  // Update userDetails when the users or loading status changes
  useEffect(() => {
    setUserDetails(() => initializeUserDetails());
  }, [initializeUserDetails]);

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <Text style={styles.titleText}>Profile</Text> */}
      <View style={styles.profileContainer}>
        <Ionicons name="person-circle" size={100} />
        <View>
          <Text style={styles.profileUsername}>{userDetails?.name}</Text>
          <Text style={styles.profileEmail}>{userDetails?.email}</Text>
        </View>
      </View>

      <View style={styles.profileButtonContainer}>
        <Pressable
          onPress={() => {
            Alert.alert(
              "Are you sure?",
              `User associated to ${user?.email} will be logged out`,
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Confirm",
                  onPress: () => signOut(),
                  style: "destructive",
                },
              ],
              { cancelable: true }
            );
          }}
          style={styles.profileSignoutButton}
        >
          <Text style={styles.profileSignoutButtonText}>Sign Out</Text>
        </Pressable>
        <Pressable onPress={() => {}} style={styles.profileButtonContainerBtn}>
          <Text style={styles.profileButtonContainerBtnText}>Edit Profile</Text>
        </Pressable>
        <Pressable
          onPress={onClickDeleteProfile}
          style={styles.profileButtonContainerBtnDelete}
        >
          <Text style={styles.profileButtonContainerBtnText}>
            Delete Profile
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    fontFamily: "Quicksand_700Bold",
    textAlign: "center",
    paddingVertical: 20,
  },
  profileContainer: {
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "column",
    rowGap: 5,
    marginBottom: 50,
  },
  profileUsername: {
    textAlign: "center",
    fontSize: 20,
  },
  profileEmail: {
    textAlign: "center",
    fontSize: 12,
  },
  profileSignoutButton: {
    backgroundColor: "#8E8E8F",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  profileSignoutButtonText: {
    color: "#fff",
  },
  profileButtonContainer: {
    marginHorizontal: 25,
    marginVertical: 35,
    rowGap: 15,
  },
  profileButtonContainerBtn: {
    backgroundColor: "#1E9CFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  profileButtonContainerBtnDelete: {
    backgroundColor: "#E51C11",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  profileButtonContainerBtnText: {
    color: "#fff",
  },
});
