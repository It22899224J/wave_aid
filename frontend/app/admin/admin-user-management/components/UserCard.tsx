import Loader from "@/components/loader/Loader";
import { User } from "@/context/AllUserContext";
import { useState } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const UserCard = ({ user }: { user: User }) => {
  const [loading, isLoading] = useState(false);
  const navigate = useNavigation();

  const deleteProfile = async (userId: string) => {
    if (user) {
      isLoading(true);
      await axios
        .delete(`http://192.168.1.5:3000/delete-user/${userId}`)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          throw Error(err);
        });
      try {
        // Alert.alert("Success", "Account deleted successfully!");
      } catch (error) {
        console.error("Error deleting user account:", error);
        throw error;
      } finally {
        isLoading(false);
      }
    }
  };

  const onClickDelete = (userId: string) => {
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
          onPress: () => deleteProfile(userId),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const safeNavigate = (navigate: any, route: string, params: any) => {
    navigate.navigate(route, params);
  };

  const onClickUpdate = () => {
    Alert.alert(
      "Are you sure?",
      `User associated to ${user?.email} will be updated`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () =>
            safeNavigate(navigate, "Admin Update User", {
              userId: user.userId,
            }),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) return <Loader />;

  return (
    <View style={styles.mainContainer}>
      <View>
        <Text>Name : {user.name}</Text>
        <Text>Name : {user.email}</Text>
        <Text>Name : {user.contactNo}</Text>
        <Text>Name : {user.role}</Text>
      </View>
      <View style={styles.iconContainer}>
        <Icon name="edit" size={20} onPress={onClickUpdate} />
        <Icon
          name="delete"
          size={20}
          color={"#ff6644"}
          onPress={() => onClickDelete(user.userId)}
        />
      </View>
    </View>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  mainContainer: {
    // marginTop: 20,
    // marginHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#dfdfdf",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
    elevation: 6,
  },
  iconContainer: {
    flexDirection: "row",
    columnGap: 20,
  },
});
