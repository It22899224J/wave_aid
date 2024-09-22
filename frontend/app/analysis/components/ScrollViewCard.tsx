import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
} from "react-native";
import {
  Quicksand_300Light,
  Quicksand_400Regular,
  Quicksand_700Bold,
} from "@expo-google-fonts/quicksand";
import {
  Raleway_200ExtraLight,
  Raleway_700Bold,
} from "@expo-google-fonts/raleway";
import { useFonts } from "expo-font";
import Loader from "@/components/loader/Loader";

const ScrollViewCard = ({
  CardTitle,
  CardIconName,
  CardIconSize,
  onPress
}: {
  CardTitle: string;
  CardIconName: string;
  CardIconSize?: number;
  onPress: () => void
}) => {
  const [fontsLoaded] = useFonts({
    Raleway_200ExtraLight,
    Raleway_700Bold,
    Quicksand_300Light,
    Quicksand_400Regular,
    Quicksand_700Bold,
  });
  if (!fontsLoaded) {
    return (
      <Loader />
    );
  }

  return (
    <Pressable style={styles.scrollViewCard} onPress={onPress}>
      <View style={styles.scrollViewCardCol1}>
        <Ionicons name={CardIconName as any} size={CardIconSize ?? 35} />
      </View>
      <View style={styles.scrollViewCardCol2}>
        <Text style={styles.scrollViewCardTitleText}>{CardTitle}</Text>
      </View>
    </Pressable>
  );
};

export default ScrollViewCard;

const styles = StyleSheet.create({
  scrollViewCard: {
    width: "100%",
    elevation: 5,
    marginVertical: 8,
    marginHorizontal: "auto",
    flexDirection: "row",
    backgroundColor: "#ddd",
    paddingHorizontal: 15,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
  },

  scrollViewCardCol1: {
    flex: 1,
  },

  scrollViewCardCol2: {
    flex: 5,
  },

  scrollViewCardTitleText: {
    fontSize: 18,
    fontFamily: "Raleway_700Bold",
  },

  scrollViewCardDescriptionText: {
    fontSize: 12,
    fontFamily: "Quicksand_400Regular",
  },
});
