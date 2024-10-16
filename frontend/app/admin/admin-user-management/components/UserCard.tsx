import Loader from "@/components/loader/Loader";
import { User } from "@/context/AllUserContext";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const UserCard = ({
  user,
  onUserDeleted,
}: {
  user: User;
  onUserDeleted: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const safeNavigate = (navigate: any, route: string, params: any) => {
    navigate.navigate(route, params);
  };

  const getRandomColor = (name: string) => {
    const colors = [
      "#FF9800",
      "#2196F3",
      "#4CAF50",
      "#9C27B0",
      "#F44336",
      "#009688",
    ];
    const index =
      name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index];
  };

  const navigate = useNavigation();
  const deleteProfile = async () => {
    if (user) {
      setLoading(true);
      try {
        await axios.delete(
          `http://192.168.1.5:3000/adminUser/delete-user/${user.userId}`
        );
        onUserDeleted(); // Callback to refresh the list
      } catch (error) {
        console.error("Error deleting user account:", error);
        Alert.alert("Error", "Failed to delete user account");
      } finally {
        setLoading(false);
      }
    }
  };

  const onClickDelete = () => {
    Alert.alert(
      "Delete User",
      `Are you sure you want to delete ${user.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: deleteProfile,
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const onClickUpdate = () => {
    Alert.alert(
      "Update User",
      `Do you want to update ${user.name}'s details?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Update",
          onPress: () =>
            safeNavigate(navigate, "Admin Update User", {
              userId: user.userId,
            }),
          style: "default",
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) return <Loader />;

  return (
    <View style={styles.userCard}>
      <View style={styles.userAvatarContainer}>
        <View
          style={[
            styles.userAvatar,
            { backgroundColor: getRandomColor(user.name) },
          ]}
        >
          <Text style={styles.userInitials}>
            {user.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <Text style={styles.userContact}>{user.contactNo}</Text>
        <View style={styles.userRoleContainer}>
          <Ionicons
            name={user.role === "Admin" ? "shield-checkmark" : "person"}
            size={14}
            color={user.role === "Admin" ? "#4CAF50" : "#666"}
          />
          <Text
            style={[styles.userRole, user.role === "Admin" && styles.adminRole]}
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={onClickUpdate}
        >
          <Ionicons name="create-outline" size={20} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={onClickDelete}
        >
          <Ionicons name="trash-outline" size={20} color="#FF5252" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#FFF",
    // padding: 20,
    // paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  statItem: {
    flex: 1,
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
  listContainer: {
    padding: 20,
  },
  userCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.84,
    elevation: 2,
  },
  userAvatarContainer: {
    marginRight: 15,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  userInitials: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  userEmail: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  userContact: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  userRoleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  userRole: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  adminRole: {
    color: "#4CAF50",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  editButton: {
    borderColor: "#2196F3",
  },
  deleteButton: {
    borderColor: "#FF5252",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#2196F3",
    width: 56,
    height: 56,
    borderRadius: 28,
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
});

export default UserCard;
