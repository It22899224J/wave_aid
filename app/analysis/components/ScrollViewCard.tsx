import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, View, Text, StyleSheet } from "react-native";

const ScrollViewCard = ({
  CardTitle,
  CardIconName,
  CardIconSize,
}: {
  CardTitle: string;
  CardIconName: string;
  CardIconSize?: number;
}) => {
  return (
    <Pressable style={styles.scrollViewCard}>
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
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "space-between",
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
