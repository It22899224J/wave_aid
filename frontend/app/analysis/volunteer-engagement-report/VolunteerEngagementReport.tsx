import React from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const volunteerData = [
  {
    month: "Jan",
    attendanceRate: 75,
    recurringVolunteers: 40,
    newVolunteers: 15,
    hoursContributed: 220,
    satisfactionRating: 4.2,
  },
  {
    month: "Feb",
    attendanceRate: 80,
    recurringVolunteers: 45,
    newVolunteers: 20,
    hoursContributed: 260,
    satisfactionRating: 4.3,
  },
  {
    month: "Mar",
    attendanceRate: 85,
    recurringVolunteers: 50,
    newVolunteers: 25,
    hoursContributed: 300,
    satisfactionRating: 4.5,
  },
  {
    month: "Apr",
    attendanceRate: 82,
    recurringVolunteers: 48,
    newVolunteers: 18,
    hoursContributed: 280,
    satisfactionRating: 4.4,
  },
  {
    month: "May",
    attendanceRate: 88,
    recurringVolunteers: 55,
    newVolunteers: 30,
    hoursContributed: 340,
    satisfactionRating: 4.6,
  },
];

const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

const VolunteerEngagementReport = () => {
  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {/* <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Volunteer Engagement Report
      </Text> */}

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
              population: volunteerData.reduce(
                (sum, data) => sum + data.recurringVolunteers,
                0
              ),
              color: "#FF6384",
              legendFontColor: "#7F7F7F",
              legendFontSize: 15,
            },
            {
              name: "New",
              population: volunteerData.reduce(
                (sum, data) => sum + data.newVolunteers,
                0
              ),
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
        />
      </View>
    </ScrollView>
  );
};

export default VolunteerEngagementReport;
