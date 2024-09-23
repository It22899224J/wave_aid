import React from "react";
import { View, Text, Dimensions, SafeAreaView, ScrollView } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const eventData = [
  { date: "2023-01", events: 5, participants: 100, wasteCollected: 500 },
  { date: "2023-02", events: 7, participants: 150, wasteCollected: 750 },
  { date: "2023-03", events: 6, participants: 200, wasteCollected: 600 },
  { date: "2023-04", events: 2, participants: 350, wasteCollected: 400 },
  { date: "2023-05", events: 4, participants: 500, wasteCollected: 750 },
];

const wasteTypeData = [
  {
    name: "Plastics",
    value: 50,
    color: "rgba(131, 167, 234, 1)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
  {
    name: "Glass",
    value: 20,
    color: "#F00",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
  {
    name: "Metal",
    value: 15,
    color: "rgb(0, 0, 255)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
  {
    name: "Other",
    value: 15,
    color: "rgb(0, 255, 0)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
];

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.7,
  useShadowColorFromDataset: false,
  propsForLabels: {
    fontSize: 10,
  },
  // propsForVerticalLabels: {
  //   fontSize: 8,
  //   rotation: 45,
  //   originY: 0,
  //   y: 5,
  // },
};

const EventSummaryReport = () => {
  const calculateYAxisMin = (min: number, max: number) =>
    Math.floor(min - (max - min) * 0.1);

  const participantsMin = Math.min(...eventData.map((d) => d.participants));
  const participantsMax = Math.max(...eventData.map((d) => d.participants));
  const eventsMin = Math.min(...eventData.map((d) => d.events));
  const eventsMax = Math.max(...eventData.map((d) => d.events));
  const wasteCollectedMin = Math.min(...eventData.map((d) => d.wasteCollected));
  const wasteCollectedMax = Math.max(...eventData.map((d) => d.wasteCollected));

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ padding: 16 }}>
          

          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            Events Over Time
          </Text>
          <LineChart
            data={{
              labels: eventData.map((d) => d.date),
              datasets: [
                {
                  data: eventData.map((d) => d.events),
                  color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
              legend: ["Events"],
            }}
            width={screenWidth - 32}
            height={300}
            chartConfig={{
              ...chartConfig,
            }}
            bezier
            style={{ marginVertical: 8, borderRadius: 16 }}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero={true}
            formatYLabel={(value) => Math.round(Number(value)).toString()}
            // yAxisInterval={5}
            // yLabelsOffset={5}
            segments={5}

          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventSummaryReport;
