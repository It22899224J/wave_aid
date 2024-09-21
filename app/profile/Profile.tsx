import { useAuth } from "@/context/AuthContext";
import { Button, SafeAreaView, Text, View } from "react-native";

const Profile = () => {
  const { signOut } = useAuth();
  return (
    <SafeAreaView>
      <View>
        <Text>Profile</Text>
        <Button title="Sign Out" onPress={signOut} />
      </View>
    </SafeAreaView>
  );
};

export default Profile;
