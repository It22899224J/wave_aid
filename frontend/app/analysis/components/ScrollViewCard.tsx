import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
import { useNavigation } from "@react-navigation/native";

export interface ScrollCardProps {
  CardTitle: string;
  CardIconName: string;
  CardIconSize?: number;
  onPressLocation: string;
}

const ScrollViewCard = ({
  CardTitle,
  CardIconName,
  CardIconSize,
  onPressLocation,
}: ScrollCardProps) => {
  const navigate = useNavigation();
  const [fontsLoaded] = useFonts({
    Raleway_200ExtraLight,
    Raleway_700Bold,
    Quicksand_300Light,
    Quicksand_400Regular,
    Quicksand_700Bold,
  });
  if (!fontsLoaded) {
    return <Loader />;
  }

  return (
    <TouchableOpacity
      style={styles.scrollViewCard}
      onPress={() => navigate.navigate(onPressLocation as never)}
    >
      <View style={styles.scrollViewCardCol1}>
        <Ionicons name={CardIconName as any} size={CardIconSize ?? 35} />
      </View>
      <View style={styles.scrollViewCardCol2}>
        <Text style={styles.scrollViewCardTitleText}>{CardTitle}</Text>
      </View>
    </TouchableOpacity>
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
