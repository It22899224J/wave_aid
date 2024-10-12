import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { chartConfig } from "../AnalysisDashboard";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/service/firebase";
import Loader from "@/components/loader/Loader";

const screenWidth = Dimensions.get("window").width;

// const volunteerData = [
//   {
//     month: "Jan",
//     attendanceRate: 75,
//     recurringVolunteers: 40,
//     newVolunteers: 15,
//     hoursContributed: 220,
//     satisfactionRating: 4.2,
//   },
//   {
//     month: "Feb",
//     attendanceRate: 80,
//     recurringVolunteers: 45,
//     newVolunteers: 20,
//     hoursContributed: 260,
//     satisfactionRating: 4.3,
//   },
//   {
//     month: "Mar",
//     attendanceRate: 85,
//     recurringVolunteers: 50,
//     newVolunteers: 25,
//     hoursContributed: 300,
//     satisfactionRating: 4.5,
//   },
//   {
//     month: "Apr",
//     attendanceRate: 82,
//     recurringVolunteers: 48,
//     newVolunteers: 18,
//     hoursContributed: 280,
//     satisfactionRating: 4.4,
//   },
//   {
//     month: "May",
//     attendanceRate: 88,
//     recurringVolunteers: 55,
//     newVolunteers: 30,
//     hoursContributed: 340,
//     satisfactionRating: 4.6,
//   },
// ];

const VolunteerEngagementReport = () => {
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
            data.attendanceRate &&
            data.recurringVolunteers &&
            data.newVolunteers &&
            data.hoursContributed &&
            data.satisfactionRating
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
  const volunteerDataByMonth = dataList.reduce((acc, d) => {
    const date = new Date(d.date);
    const monthYear = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!acc[monthYear]) {
      acc[monthYear] = {
        events: 0,
        attendanceRate: 0,
        recurringVolunteers: 0,
        newVolunteers: 0,
        hoursContributed: 0,
        satisfactionRating: 0,
      };
    }

    acc[monthYear].events += 1;
    acc[monthYear].attendanceRate += d.attendanceRate;
    acc[monthYear].recurringVolunteers += d.recurringVolunteers;
    acc[monthYear].newVolunteers += d.newVolunteers;
    acc[monthYear].hoursContributed += d.hoursContributed;
    acc[monthYear].satisfactionRating += d.satisfactionRating;

    return acc;
  }, {});

  const volunteerData = Object.entries(volunteerDataByMonth)
    .map(([month, data]) => ({
      month,
      attendanceRate: data.attendanceRate / data.events,
      recurringVolunteers: data.recurringVolunteers,
      newVolunteers: data.newVolunteers,
      hoursContributed: data.hoursContributed,
      satisfactionRating: data.satisfactionRating / data.events,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const totalVolunteers = volunteerData.reduce(
    (sum, data) => sum + data.recurringVolunteers + data.newVolunteers,
    0
  );

  const recurringPercentage =
    (volunteerData.reduce((sum, data) => sum + data.recurringVolunteers, 0) /
      totalVolunteers) *
    100;

  const newPercentage =
    (volunteerData.reduce((sum, data) => sum + data.newVolunteers, 0) /
      totalVolunteers) *
    100;

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          Volunteer Attendance Rate
        </Text>
        <LineChart
          data={{
            labels: volunteerData.map((d) => d.month),
            datasets: [
              {
                data: volunteerData.map((d) => d.attendanceRate),
              },
            ],
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          Recurring vs New Volunteers
        </Text>
        <BarChart
          data={{
            labels: volunteerData.map((d) => d.month),
            datasets: [
              {
                data: volunteerData.map((d) => d.recurringVolunteers),
              },
              {
                data: volunteerData.map((d) => d.newVolunteers),
              },
            ],
          }}
          yAxisLabel=""
          yAxisSuffix=""
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          Volunteer Hours Contributed
        </Text>
        <LineChart
          data={{
            labels: volunteerData.map((d) => d.month),
            datasets: [
              {
                data: volunteerData.map((d) => d.hoursContributed),
              },
            ],
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          Volunteer Satisfaction Ratings
        </Text>
        <BarChart
          data={{
            labels: volunteerData.map((d) => d.month),
            datasets: [
              {
                data: volunteerData.map((d) => d.satisfactionRating),
              },
            ],
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          style={{ marginVertical: 8, borderRadius: 16 }}
          yAxisSuffix=""
          yAxisLabel=""
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          Overall Volunteer Composition
        </Text>
        <PieChart
          data={[
            {
              name: "Recurring",
              population: recurringPercentage,
              color: "#FF6384",
              legendFontColor: "#7F7F7F",
              legendFontSize: 15,
            },
            {
              name: "New",
              population: newPercentage,
              color: "#36A2EB",
              legendFontColor: "#7F7F7F",
              legendFontSize: 15,
            },
          ]}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    </ScrollView>
  );
};

export default VolunteerEngagementReport;
