import { NavigationProp } from "@react-navigation/native";
import { SafeAreaView, Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";

interface Props {
  navigation: NavigationProp<any>;
}

const AdminHome = ({ navigation }: Props) => {
  return (
    <SafeAreaView>
      <View>
        <Text>Admin Home</Text>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  

});

export default AdminHome;
