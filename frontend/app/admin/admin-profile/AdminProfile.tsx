import { useAllUser, User } from "@/context/AllUserContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Pressable,
  Alert,
  ImageBackground,
  ScrollView,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";

const { width } = Dimensions.get("window");

const images = [
  require("../../../assets/images/profile-bg-1.jpg"),
  require("../../../assets/images/profile-bg-2.jpg"),
  require("../../../assets/images/profile-bg-3.jpg"),
  require("../../../assets/images/profile-bg-4.jpg"),
  require("../../../assets/images/profile-bg-5.jpg"),
];

const AdminProfile = () => {
  const { signOut, user, loading: authLoading } = useAuth();
  const { users, loading: allUserLoading } = useAllUser();
  const [userDetails, setUserDetails] = useState<User | undefined>();
  const navigation = useNavigation();
  const [backgroundImage, setBackgroundImage] = useState(undefined);
  const [lastLogin, setLastLogin] = useState("");

  const initializeUserDetails = useCallback(() => {
    if (!allUserLoading && !authLoading) {
      const matchedUser = users?.find(
        (userDoc) => userDoc.userId === user?.uid
      );
      return matchedUser;
    }
  }, [allUserLoading, authLoading, users, user]);

  const getUserLastLoginTime = async (uid: string) => {
    try {
      const response = await axios.get(
        `http://192.168.1.5:3000/adminUser/getUserLastLoginTime/${uid}`
      );
      // console.log("Last login time:", response.data);
      return response.data; // Return the data for further processing if needed
    } catch (error) {
      console.error("Error fetching last login time:", error);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const details = initializeUserDetails();
      if (details) {
        setUserDetails(details);
      }

      // Check if the user exists before calling the async function
      if (user) {
        try {
          const lastLoginTime = await getUserLastLoginTime(user?.uid);
          // const lastLogin = new Date(lastLoginTime);
          // setLastLogin(
          //   `${lastLogin.getUTCDate()} ${lastLogin.toLocaleString("en-US", {
          //     month: "short",
          //   })} ${lastLogin.getUTCFullYear()} | ${lastLogin.getUTCHours()}:${lastLogin
          //     .getUTCMinutes()
          //     .toString()
          //     .padStart(2, "0")}`
          // );
          setLastLogin(lastLoginTime);
        } catch (error) {
          console.error("Error fetching last login time:", error);
        }
      }

      // Set a random background image
      const randomIndex = Math.floor(Math.random() * 5);
      setBackgroundImage(images[randomIndex]);
    };

    // Call the async function
    fetchUserDetails();
  }, [initializeUserDetails]);

  const AdminCard = ({
    title,
    value,
    icon,
  }: {
    title: string;
    value: string | number;
    icon: any;
  }) => (
    <View style={styles.adminCard}>
      <Ionicons name={icon} size={24} color="#2196F3" />
      <View>
        <Text style={styles.adminCardTitle}>{title}</Text>
        <Text style={styles.adminCardValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ImageBackground
          source={backgroundImage}
          style={styles.headerBackground}
        >
          <View style={styles.headerOverlay}>
            <Text style={styles.adminBadge}>Administrator</Text>
          </View>
        </ImageBackground>

        <View style={styles.profileContent}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <Ionicons name="person-circle" size={100} color="#1976D2" />
            </View>
          </View>

          <View style={styles.userInfoContainer}>
            <Text style={styles.userName}>{userDetails?.name}</Text>
            <View style={styles.roleContainer}>
              <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
              <Text style={styles.roleText}>{userDetails?.role}</Text>
            </View>
            <Text style={styles.userEmail}>{userDetails?.email}</Text>
          </View>

          <View style={styles.adminStatsContainer}>
            <AdminCard
              title="Total Users"
              value={users?.length || 0}
              icon="people-outline"
            />
            <AdminCard
              title="Active Sessions"
              value="24"
              icon="pulse-outline"
            />
            <AdminCard
              title="Last Login"
              value={lastLogin ?? ""}
              icon="time-outline"
            />
          </View>

          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionButtonsContainer}>
              <Pressable
                style={styles.actionButton}
                onPress={() =>
                  navigation.navigate("Admin All User Dashboard" as never)
                }
              >
                <Ionicons name="people" size={24} color="#FFF" />
                <Text style={styles.actionButtonText}>Manage Users</Text>
              </Pressable>

              <Pressable
                style={styles.actionButton}
                onPress={() => navigation.navigate("Settings" as never)}
              >
                <Ionicons name="settings" size={24} color="#FFF" />
                <Text style={styles.actionButtonText}>System Settings</Text>
              </Pressable>

              <Pressable
                style={styles.actionButton}
                onPress={() =>
                  navigation.navigate("Analysis Dashboard" as never)
                }
              >
                <Ionicons name="bar-chart" size={24} color="#FFF" />
                <Text style={styles.actionButtonText}>Analytics</Text>
              </Pressable>
            </View>
          </View>

          <Pressable
            style={styles.signOutButton}
            onPress={() => {
              Alert.alert("Sign Out", "Are you sure you want to sign out?", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Sign Out",
                  onPress: signOut,
                  style: "destructive",
                },
              ]);
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="#FFF" />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
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
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 20,
  },
  adminBadge: {
    backgroundColor: "#4CAF50",
    color: "white",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "bold",
  },
  profileContent: {
    flex: 1,
    marginTop: -60,
    paddingBottom: 20,
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
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 5,
  },
  roleText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "600",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  adminStatsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    gap: 10,
  },
  adminCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    gap: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.84,
    elevation: 2,
  },
  adminCardTitle: {
    fontSize: 12,
    color: "#666",
  },
  adminCardValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  quickActionsContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 5,
    textAlign: "center",
  },
  signOutButton: {
    backgroundColor: "#757575",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 25,
    gap: 10,
  },
  signOutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AdminProfile;
