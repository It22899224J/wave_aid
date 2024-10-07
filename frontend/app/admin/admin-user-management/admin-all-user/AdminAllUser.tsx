import Loader from "@/components/loader/Loader";
import { useAllUser, User } from "@/context/AllUserContext";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import UserCard from "../components/UserCard";
import { FlatList } from "react-native-gesture-handler";
import { Divider } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import Icon from "react-native-vector-icons/Ionicons";

const AdminAllUser = () => {
  const { users, loading: allUserLoading } = useAllUser();
  const { user } = useAuth();
  const navigate = useNavigation();
  if (allUserLoading) {
    return <Loader />;
  }
  return (
    <View style={styles.allUserContainer}>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigate.navigate("Admin Creatw User" as never)}
      >
        <Text style={styles.buttonText}>
          <Icon name="add" color={'#fff'} size={35} />
        </Text>
      </TouchableOpacity>
      <FlatList<User>
        style={styles.flatListContainer}
        data={users?.filter(
          (singleUser: User) => singleUser.userId != user?.uid
        )}
        renderItem={(item) => <UserCard user={item.item} key={item.index} />}
        ItemSeparatorComponent={() => (
          <View style={styles.divider}>
            <Divider />
          </View>
        )}
      />
    </View>
  );
};

export default AdminAllUser;

const styles = StyleSheet.create({
  allUserContainer: {
    marginVertical: 10,
  },
  divider: {
    marginVertical: 10,
  },
  buttonContainer: {
    zIndex: 99,
    position: "absolute",
    bottom: 0,
    right: 20,
    width: "14%",
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    borderRadius: 100,
    alignItems: "center",
    // marginBottom: 10,
    alignSelf: "flex-end",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  flatListContainer: {
    // marginBottom: 50,
    marginHorizontal: 20,
  },
});
