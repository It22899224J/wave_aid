import Loader from "@/components/loader/Loader";
import { User } from "@/context/AllUserContext";
import { useState } from "react";
import { Text, View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const UserCard = ({ user }: { user: User }) => {
  const [loading, isLoading] = useState(false);
  const navigate = useNavigation();

  const deleteProfile = async () => {
    if (user) {
      isLoading(true);
      await axios
        .delete(`http://192.168.1.5:3000/delete-user/${user.userId}`)
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

  const onClickDelete = () => {
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
        <Text>Email : {user.email}</Text>
        <Text>Contact No : {user.contactNo}</Text>
        <Text>Role : {user.role}</Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={onClickUpdate}>
          <Icon name="edit" size={23} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onClickDelete}>
          <Icon
            name="delete"
            size={23}
            color={"#ff6644"}
            onPress={onClickDelete}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  mainContainer: {
    // marginTop: 20,
    // marginHorizontal: 15,
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    rowGap: 20,
    backgroundColor: "#dfdfdf",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
    elevation: 6,
  },
  iconContainer: {
    flexDirection: "row",
    columnGap: 50,
  },
});
