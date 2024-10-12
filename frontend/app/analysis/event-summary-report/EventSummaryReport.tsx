import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { chartConfig } from "../AnalysisDashboard";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/service/firebase";
import Loader from "@/components/loader/Loader";

const screenWidth = Dimensions.get("window").width;

// const eventData = [
//   { date: "2023-01", events: 2, participants: 30, wasteCollected: 150 },
//   { date: "2023-02", events: 3, participants: 45, wasteCollected: 200 },
//   { date: "2023-03", events: 4, participants: 60, wasteCollected: 300 },
//   { date: "2023-04", events: 3, participants: 40, wasteCollected: 180 },
//   { date: "2023-05", events: 5, participants: 75, wasteCollected: 350 },
// ];

// const wasteTypes = [
//   { name: "Plastics", percentage: 60, color: "rgba(255, 99, 132, 1)" },
//   { name: "Glass", percentage: 15, color: "rgba(54, 162, 235, 1)" },
//   { name: "Metal", percentage: 10, color: "rgba(255, 206, 86, 1)" },
//   { name: "Paper", percentage: 10, color: "rgba(75, 192, 192, 1)" },
//   { name: "Other", percentage: 5, color: "rgba(153, 102, 255, 1)" },
// ];

const EventSummaryReport = () => {
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
          if (data.date && data.eventName && data.totalParticipants && data.wasteCollected && data.wasteTypes) {
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
  if (dataList.length === 0) return <Text style={{ padding: 16 }}>No data available.</Text>;

  console.log("Total events:", dataList.length);

  // Combine event data by month
  const eventDataByMonth = dataList.reduce((acc, d) => {
    const date = new Date(d.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = { events: 0, participants: 0, wasteCollected: 0 };
    }
    
    acc[monthYear].events += 1;
    acc[monthYear].participants += Number(d.totalParticipants) || 0;
    acc[monthYear].wasteCollected += Number(d.wasteCollected) || 0;
    
    return acc;
  }, {});

  console.log("Events by month:", eventDataByMonth);

  const eventData = Object.entries(eventDataByMonth).map(([date, data]) => ({
    date,
    ...data,
  })).sort((a, b) => a.date.localeCompare(b.date));

  console.log("Processed event data:", eventData);

  // Calculate total waste collected
  const totalWasteCollected = eventData.reduce((sum, event) => sum + event.wasteCollected, 0);

  // Aggregate waste types across all events
  const aggregatedWasteTypes = dataList.reduce((acc, event) => {
    event.wasteTypes.forEach(wt => {
      if (!acc[wt.type]) {
        acc[wt.type] = { amount: 0, color: wt.color };
      }
      acc[wt.type].amount += (wt.percentage / 100) * event.wasteCollected;
    });
    return acc;
  }, {});

  // Calculate percentages based on total waste collected
  const wasteTypesData = Object.entries(aggregatedWasteTypes).map(([type, data]) => ({
    type,
    percentage: (data.amount / totalWasteCollected) * 100,
    color: data.color,
  }));

  // Render charts only if there's data
  const renderCharts = () => (
    <>
      {/* Number of Events Over Time */}
      {eventData.length > 0 && (
        <>
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
        </>
      )}

      {/* Total Participants per Month */}
      {eventData.length > 0 && (
        <>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
            Total Participants per Month
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
        </>
      )}

      {/* Amount of Waste Collected per Month */}
      {eventData.length > 0 && (
        <>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
            Amount of Waste Collected per Month
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
        </>
      )}

      {/* Types of Waste Collected */}
      {wasteTypesData.length > 0 && (
        <>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
            Types of Waste Collected
          </Text>
          <PieChart
            data={wasteTypesData.map((wt) => ({
              name: wt.type,
              population: Number(wt.percentage.toFixed(2)),
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
        </>
      )}
    </>
  );

  return (
    <ScrollView style={{ padding: 16 }}>
      {renderCharts()}
    </ScrollView>
  );
};

export default EventSummaryReport;
