import { View, Image, StyleSheet, Text } from "react-native";
import Icon from "../../assets/images/appIcon.png";

const SplashScreen = () => (
  <>
    <View style={styles.container}>
      <View>
        <Image source={Icon} style={styles.image} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    </View>
  </>
);

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0477BF",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "cover",
  },
  text: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
});
