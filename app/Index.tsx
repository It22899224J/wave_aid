import { useAuth } from "@/context/AuthContext";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const { signOut } = useAuth();
  return (
    <>
      <SafeAreaView>
        <Text>This is index</Text>
        <Button title="Signout" onPress={signOut} />
      </SafeAreaView>
    </>
  );
};

export default Index;
