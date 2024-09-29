import Loader from "@/components/loader/Loader";
import { useAllUser, User } from "@/context/AllUserContext";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import UserCard from "../components/UserCard";
import { FlatList } from "react-native-gesture-handler";
import { Divider } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";

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
        <Text style={styles.buttonText}>Add Admin User</Text>
      </TouchableOpacity>
      <FlatList<User>
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
    marginVertical: 30,
    marginHorizontal: 20,
  },
  divider: {
    marginVertical: 10,
  },
  buttonContainer: {
    width: "50%",
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    alignSelf: "flex-end",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
