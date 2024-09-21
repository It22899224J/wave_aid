import {
  Text,
  StyleSheet,
  Pressable,
  View,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

const AnalysisDashboard = () => {
  const [fontsLoaded] = useFonts({
    Raleway_200ExtraLight,
    Raleway_700Bold,
    Quicksand_300Light,
    Quicksand_400Regular,
    Quicksand_700Bold,
  });
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }
  return (
    <SafeAreaView>
      <View style={styles.analysisContainer}>
        <Text style={styles.titleText}>Analysis Dashboard</Text>
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
        <ScrollView style={styles.scrollViewContainer}>
          <ScrollViewCard
            CardTitle="Event Summary Report"
            CardIconName="albums"
          />
          <ScrollViewCard
            CardTitle="Performance Report"
            CardIconName="trending-up"
          />
          <ScrollViewCard
            CardTitle="Geographic Impact Report"
            CardIconName="location"
          />
          <ScrollViewCard
            CardTitle="Waste Composition Report"
            CardIconName="trash"
          />
          <ScrollViewCard
            CardTitle="Volunteer Engagement Report"
            CardIconName="people"
          />
          <ScrollViewCard
            CardTitle="Enviroment Impact Report"
            CardIconName="earth"
          />
          <ScrollViewCard
            CardTitle="Transport Efficency Report"
            CardIconName="bus"
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AnalysisDashboard;

const styles = StyleSheet.create({
  analysisContainer: {
    // marginVertical: 10,
    marginHorizontal: 15,
    flexDirection: "column",
  },

  titleText: {
    fontSize: 18,
    fontFamily: "Quicksand_700Bold",
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
    height: 450,
    marginVertical: 8,
    marginHorizontal: "auto",
    borderRadius: 16,
  },
});
