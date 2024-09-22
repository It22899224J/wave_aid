import {
  Text,
  StyleSheet,
  Pressable,
  View,
  Dimensions,
  ScrollView,
  Image,
  SafeAreaView
} from "react-native";
import {
  Raleway_200ExtraLight,
  Raleway_700Bold,
} from "@expo-google-fonts/raleway";
import {
  Quicksand_300Light,
  Quicksand_400Regular,
  Quicksand_700Bold,
} from "@expo-google-fonts/quicksand";
import { useFonts } from "expo-font";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import ScrollViewCard from "./components/ScrollViewCard";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import Loader from "@/components/loader/Loader";

const AnalysisDashboard = () => {
  const navigate = useNavigation();

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
    <SafeAreaView>
      <View style={styles.analysisContainer}>
        {/* <Text style={styles.titleText}>Analysis Dashboard</Text> */}
        <ScrollView style={styles.scrollViewContainer}>
          <LineChart
            data={{
              labels: ["January", "February", "March", "April", "May", "June"],
              datasets: [
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                  ],
                },
              ],
            }}
            width={
              Dimensions.get("window").width -
              Math.round((Dimensions.get("window").width * 10) / 100)
            } // from react-native
            height={275}
            //   yAxisLabel="$"
            yAxisSuffix="k"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={styles.chart}
          />
          <Text style={styles.chartCaption}>Volunteer Interation</Text>
          <ScrollViewCard
            CardTitle="Event Summary Report"
            CardIconName="albums"
            onPress={() => navigate.navigate("Event Summary Report" as never)}
          />
          <ScrollViewCard
            CardTitle="Performance Report"
            CardIconName="trending-up"
            onPress={() => navigate.navigate("Performance Report" as never)}
          />
          <ScrollViewCard
            CardTitle="Geographic Impact Report"
            CardIconName="location"
            onPress={() =>
              navigate.navigate("Geographic Impact Report" as never)
            }
          />
          <ScrollViewCard
            CardTitle="Waste Composition Report"
            CardIconName="trash"
            onPress={() =>
              navigate.navigate("Waste Composition Report" as never)
            }
          />
          <ScrollViewCard
            CardTitle="Volunteer Engagement Report"
            CardIconName="people"
            onPress={() =>
              navigate.navigate("Volunteer Engagement Report" as never)
            }
          />
          <ScrollViewCard
            CardTitle="Enviroment Impact Report"
            CardIconName="earth"
            onPress={() =>
              navigate.navigate("Enviroment Impact Report" as never)
            }
          />
          <ScrollViewCard
            CardTitle="Transport Efficency Report"
            CardIconName="bus"
            onPress={() =>
              navigate.navigate("Transport Efficency Report" as never)
            }
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AnalysisDashboard;

const styles = StyleSheet.create({
  analysisContainer: {
    // flex: 1,
    marginTop: 5,
  },

  titleText: {
    fontSize: 18,
    fontFamily: "Quicksand_700Bold",
    textAlign: "center",
    paddingVertical: 20,
  },

  chart: {
    marginVertical: 8,
    marginHorizontal: "auto",
    borderRadius: 16,
  },

  chartCaption: {
    fontSize: 11,
    margin: "auto",
    color: "#aaa",
  },

  scrollViewContainer: {
    marginHorizontal: "auto",
    paddingHorizontal: 15,
    borderRadius: 16,
  },
});
