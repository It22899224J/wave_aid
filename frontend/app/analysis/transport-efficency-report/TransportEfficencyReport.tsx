import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { chartConfig } from "../AnalysisDashboard";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/service/firebase";
import Loader from "@/components/loader/Loader";

const screenWidth = Dimensions.get("window").width;

// const transportData = [
//   {
//     date: "2023-01",
//     fuelConsumption: 100,
//     participantsTransported: 50,
//     cost: 200,
//   },
//   {
//     date: "2023-02",
//     fuelConsumption: 120,
//     participantsTransported: 60,
//     cost: 240,
//   },
//   {
//     date: "2023-03",
//     fuelConsumption: 90,
//     participantsTransported: 45,
//     cost: 180,
//   },
//   {
//     date: "2023-04",
//     fuelConsumption: 110,
//     participantsTransported: 55,
//     cost: 220,
//   },
//   {
//     date: "2023-05",
//     fuelConsumption: 130,
//     participantsTransported: 65,
//     cost: 260,
//   },
// ];

const transportTypes = [
  { name: "Bus", value: 50, color: "rgba(131, 167, 234, 1)" },
  { name: "Car", value: 30, color: "#F00" },
  { name: "Bicycle", value: 15, color: "rgb(0, 0, 255)" },
  { name: "Walk", value: 5, color: "rgb(0, 255, 0)" },
];

const TransportEfficiencyReport = () => {
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
            data.busFuelConsumption &&
            data.busUsers &&
            data.transportCost
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
  if (error) return <Text style={{ padding: 16 }}>{error}</Text>;
  if (dataList.length === 0)
    return <Text style={{ padding: 16 }}>No data available.</Text>;

  // Combine data by month
  const transportDataByMonth = dataList.reduce((acc, d) => {
    const date = new Date(d.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = {
        events: 0,
        fuelConsumption: 0,
        participantsTransported: 0,
        cost: 0,
      };
    }
    
    acc[monthYear].events += 1;
    acc[monthYear].fuelConsumption += d.busFuelConsumption;
    acc[monthYear].participantsTransported += d.busUsers;
    acc[monthYear].cost += d.transportCost;
    
    return acc;
  }, {});

  const transportData = Object.entries(transportDataByMonth).map(([date, data]) => ({
    date,
    fuelConsumption: data.fuelConsumption / data.events, // Average fuel consumption per event
    participantsTransported: data.participantsTransported, // Total participants transported
    cost: data.cost / data.events, // Average cost per event
  })).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
        Average Fuel Consumption per Event (Monthly)
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
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
        Total Participants Transported per Month
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
