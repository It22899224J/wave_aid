import { User } from "@/context/AllUserContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/service/firebase";
import Loader from "@/components/loader/Loader";

const AdminUpdateUser = ({ route }: any) => {
  const { userId } = route.params;
  const [loading, isLoading] = useState(true);
  const [formData, setFormData] = useState<User>({
    email: "",
    name: "",
    role: "User",
    userId: "",
  });

  useEffect(() => {
    const fetchFilteredUsers = async () => {
      try {
        // Create a query to filter users by role
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("userId", "==", userId)); // Assuming 'userId' is the field to filter by

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Since you mentioned only one document, we can safely use the first document
          const userDoc = querySnapshot.docs[0].data() as User;
          setFormData(userDoc); // Set the fetched user data
        } else {
          throw Error("No user found with the provided userId!");
        }
      } catch (err) {
        console.log("Failed to fetch users", err);
      } finally {
        isLoading(false);
      }
    };

    fetchFilteredUsers();
  }, []);

  const updateProfile = async (userId: string) => {
    if (userId) {
      isLoading(true);
      await axios
        .put(`http://192.168.1.5:3000/update-user/${userId}`, formData)
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

  if (loading) return <Loader />;

  return (
    <View>
      <Text>Username : {formData.name}</Text>
      <Text>role : {formData.role}</Text>
      <Text>email : {formData.email}</Text>
    </View>
  );
};

export default AdminUpdateUser;
