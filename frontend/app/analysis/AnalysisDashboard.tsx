import {
  Text,
  StyleSheet,
  Pressable,
  View,
  Dimensions,
  ScrollView,
  Image,
  SafeAreaView,
  FlatList,
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
import ScrollViewCard, { ScrollCardProps } from "./components/ScrollViewCard";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import Loader from "@/components/loader/Loader";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/service/firebase";

export const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForLabels: {
    fontSize: 10,
  },
};

// //orange background config
// const chartConfig = {
//   backgroundColor: "#e26a00",
//   backgroundGradientFrom: "#fb8c00",
//   backgroundGradientTo: "#ffa726",
//   decimalPlaces: 2,
//   color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//   style: {
//     borderRadius: 16,
//   },
//   propsForLabels: {
//     fontSize: 12,
//   },
// };

const DashboardHeaderChart = () => {
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eventCompletionsRef = collection(db, "eventCompletions");

    const unsubscribe = onSnapshot(
      eventCompletionsRef,
      (querySnapshot) => {
        const newDataList: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (
            data.date &&
            data.eventName &&
            data.totalParticipants &&
            data.wasteCollected &&
            data.wasteTypes
          ) {
            newDataList.push(data);
          }
        });
        setDataList(newDataList);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Text>{error}</Text>;

  // Group data by month and sum totalParticipants
  const groupedData = dataList.reduce((acc, event) => {
    const date = new Date(event.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = 0;
    }
    acc[monthYear] += Number(event.totalParticipants);
    return acc;
  }, {});

  // Sort the months and get the last 6 months
  const sortedMonths = Object.keys(groupedData).sort().slice(-6);
  const participantData = sortedMonths.map(month => groupedData[month]);

  // Format month labels
  const monthLabels = sortedMonths.map(month => {
    const [year, monthNum] = month.split('-');
    return `${monthNum}/${year.slice(2)}`;
  });

  return (
    <>
      <LineChart
        data={{
          labels: monthLabels,
          datasets: [
            {
              data: participantData,
            },
          ],
        }}
        width={
          Dimensions.get("window").width -
          Math.round((Dimensions.get("window").width * 10) / 100)
        }
        height={275}
        yAxisSuffix=""
        yAxisInterval={1}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
      <Text style={styles.chartCaption}>Total Participants per Month</Text>
    </>
  );
};

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
    return <Loader />;
  }
  return (
    <SafeAreaView>
      <View style={styles.analysisContainer}>
        {/* <Text style={styles.titleText}>Analysis Dashboard</Text> */}
        <FlatList<ScrollCardProps>
          style={styles.scrollViewContainer}
          data={[
            {
              CardTitle: "Event Summary Report",
              CardIconName: "albums",
              onPressLocation: "Event Summary Report",
            },
            {
              CardTitle: "Performance Report",
              CardIconName: "trending-up",
              onPressLocation: "Performance Report",
            },
            {
              CardTitle: "Geographic Impact Report",
              CardIconName: "location",
              onPressLocation: "Geographic Impact Report",
            },
            {
              CardTitle: "Waste Composition Report",
              CardIconName: "trash",
              onPressLocation: "Waste Composition Report",
            },
            {
              CardTitle: "Volunteer Engagement Report",
              CardIconName: "people",
              onPressLocation: "Volunteer Engagement Report",
            },
            {
              CardTitle: "Enviroment Impact Report",
              CardIconName: "earth",
              onPressLocation: "Enviroment Impact Report",
            },
            {
              CardTitle: "Transport Efficency Report",
              CardIconName: "bus",
              onPressLocation: "Transport Efficency Report",
            },
          ]}
          renderItem={(item) => (
            <ScrollViewCard
              CardTitle={item.item.CardTitle}
              CardIconName={item.item.CardIconName}
              CardIconSize={item.item.CardIconSize}
              onPressLocation={item.item.onPressLocation}
              key={item.index}
            />
          )}
          ListHeaderComponent={() => <DashboardHeaderChart />}
        />
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
