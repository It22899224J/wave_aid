import React from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { chartConfig } from "../AnalysisDashboard";

const screenWidth = Dimensions.get("window").width;

const eventData = [
  { date: "2023-01", events: 2, participants: 30, wasteCollected: 150 },
  { date: "2023-02", events: 3, participants: 45, wasteCollected: 200 },
  { date: "2023-03", events: 4, participants: 60, wasteCollected: 300 },
  { date: "2023-04", events: 3, participants: 40, wasteCollected: 180 },
  { date: "2023-05", events: 5, participants: 75, wasteCollected: 350 },
];

const wasteTypes = [
  { name: "Plastics", percentage: 60, color: "rgba(255, 99, 132, 1)" },
  { name: "Glass", percentage: 15, color: "rgba(54, 162, 235, 1)" },
  { name: "Metal", percentage: 10, color: "rgba(255, 206, 86, 1)" },
  { name: "Paper", percentage: 10, color: "rgba(75, 192, 192, 1)" },
  { name: "Other", percentage: 5, color: "rgba(153, 102, 255, 1)" },
];



const EventSummaryReport = () => {
  return (
    <ScrollView style={{ padding: 16 }}>
      {/* <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Event Summary Report
      </Text> */}

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
        Number of Events Over Time
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
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
        Total Participants per Event
      </Text>
      <BarChart
        data={{
          labels: eventData.map((d) => d.date),
          datasets: [
            {
              data: eventData.map((d) => d.participants),
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
        Amount of Waste Collected per Event
      </Text>
      <BarChart
        data={{
          labels: eventData.map((d) => d.date),
          datasets: [
            {
              data: eventData.map((d) => d.wasteCollected),
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
        Types of Waste Collected
      </Text>
      <PieChart
        data={wasteTypes.map((wt) => ({
          name: wt.name,
          population: wt.percentage,
          color: wt.color,
          legendFontColor: "#7F7F7F",
          legendFontSize: 12,
        }))}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </ScrollView>
  );
};

export default EventSummaryReport;
