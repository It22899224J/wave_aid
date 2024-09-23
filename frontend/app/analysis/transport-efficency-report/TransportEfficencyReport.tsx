import React from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const transportData = [
  {
    date: "2023-01",
    fuelConsumption: 100,
    participantsTransported: 50,
    cost: 200,
  },
  {
    date: "2023-02",
    fuelConsumption: 120,
    participantsTransported: 60,
    cost: 240,
  },
  {
    date: "2023-03",
    fuelConsumption: 90,
    participantsTransported: 45,
    cost: 180,
  },
  {
    date: "2023-04",
    fuelConsumption: 110,
    participantsTransported: 55,
    cost: 220,
  },
  {
    date: "2023-05",
    fuelConsumption: 130,
    participantsTransported: 65,
    cost: 260,
  },
];

const transportTypes = [
  { name: "Bus", value: 50, color: "rgba(131, 167, 234, 1)" },
  { name: "Car", value: 30, color: "#F00" },
  { name: "Bicycle", value: 15, color: "rgb(0, 0, 255)" },
  { name: "Walk", value: 5, color: "rgb(0, 255, 0)" },
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
};

const TransportEfficiencyReport = () => {
  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Transport Efficiency Report
      </Text>

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
        Fuel Consumption per Event
      </Text>
      <LineChart
        data={{
          labels: transportData.map((d) => d.date),
          datasets: [
            {
              data: transportData.map((d) => d.fuelConsumption),
              color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        // fromNumber={80}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
        Participants Transported per Event
      </Text>
      <BarChart
        data={{
          labels: transportData.map((d) => d.date),
          datasets: [
            {
              data: transportData.map((d) => d.participantsTransported),
            },
          ],
        }}
        yAxisSuffix=""
        yAxisLabel=""
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        style={{ marginVertical: 8, borderRadius: 16 }}
      />

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
        Types of Transport Used
      </Text>
      <PieChart
        data={transportTypes}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        accessor="value"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </ScrollView>
  );
};

export default TransportEfficiencyReport;
