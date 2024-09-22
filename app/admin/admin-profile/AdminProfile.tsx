import { useAllUser, User } from "@/context/AllUserContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { Button, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

const AdminProfile = () => {
  const { signOut, user, loading: authLoading } = useAuth();
  const { users, loading: allUserLoading } = useAllUser();

  const [userDetails, setUserDetails] = useState<User | undefined>();

  const navigation = useNavigation();

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
        <View>
          <TouchableOpacity>
            <Text
              onPress={() => navigation.navigate('BusSetup' as never)}
              style={{
                backgroundColor: 'blue',
                color: 'white',
                padding: 10,
                textAlign: 'center',
                marginTop: 10,
              }}
            >
              Add Bus
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AdminProfile;
