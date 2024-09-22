import { useAllUser, User } from "@/context/AllUserContext";
import { useAuth } from "@/context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { Button, SafeAreaView, Text, View } from "react-native";

const AdminProfile = () => {
  const { signOut, user, loading: authLoading } = useAuth();
  const { users, loading: allUserLoading } = useAllUser();

  const [userDetails, setUserDetails] = useState<User | undefined>();

  const initializeUserDetails = useCallback(() => {
    if (!allUserLoading && !authLoading) {
      const matchedUser = users?.find(
        (userDoc) => userDoc.userId === user?.uid
      );
      return matchedUser;
    }
  }, [allUserLoading, authLoading, users, user]);

  useEffect(() => {
    const details = initializeUserDetails();
    if (details) {
      setUserDetails(details);
    }
  }, [initializeUserDetails]);

  return (
    <SafeAreaView>
      <View>
        <Text>Profile</Text>
        <Text>Username : {userDetails?.name}</Text>
        <Text>Email : {userDetails?.email}</Text>
        <Text>Role : {userDetails?.role}</Text>
        <Button title="Sign Out" onPress={signOut} />
      </View>
    </SafeAreaView>
  );
};

export default AdminProfile;
