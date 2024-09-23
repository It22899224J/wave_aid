import React from "react";
import { View, Text, Dimensions, ScrollView, Image } from "react-native";
import { LineChart, BarChart, ProgressChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const wildlifeData = [
  { month: "Jan", count: 50 },
  { month: "Feb", count: 60 },
  { month: "Mar", count: 75 },
  { month: "Apr", count: 70 },
  { month: "May", count: 85 },
];

const pollutionData = [
  { month: "Jan", level: 80 },
  { month: "Feb", level: 75 },
  { month: "Mar", level: 70 },
  { month: "Apr", level: 65 },
  { month: "May", level: 60 },
];

const ecosystemImpact = [
  { category: "Biodiversity", score: 0.7 },
  { category: "Water Quality", score: 0.8 },
  { category: "Soil Health", score: 0.6 },
  { category: "Air Quality", score: 0.7 },
  { category: "Habitat Restoration", score: 0.8 },
];

const chartConfig = {
  backgroundColor: "#e26a00",
  backgroundGradientFrom: "#fb8c00",
  backgroundGradientTo: "#ffa726",
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForLabels: {
    fontSize: 12,
  },
};

const EnvironmentalImpactReport = () => {
  return (
    <ScrollView style={{ padding: 16, backgroundColor: "#f0f0f0" }}>
      {/* <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 16,
          color: "#333",
        }}
      >
        Environmental Impact Report
      </Text> */}

      <View
        style={{
          backgroundColor: "white",
          borderRadius: 10,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 8,
            color: "#333",
          }}
        >
          Estimated Wildlife Saved/Protected
        </Text>
        <LineChart
          data={{
            labels: wildlifeData.map((d) => d.month),
            datasets: [
              {
                data: wildlifeData.map((d) => d.count),
              },
            ],
          }}
          width={screenWidth - 64}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
        <Text style={{ fontSize: 14, color: "#666", marginTop: 8 }}>
          The graph shows an increasing trend in the number of wildlife saved or
          protected each month, indicating the positive impact of our beach
          cleaning efforts on local ecosystems.
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "white",
          borderRadius: 10,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 8,
            color: "#333",
          }}
        >
          Reduction in Pollution Levels
        </Text>
        <LineChart
          data={{
            labels: pollutionData.map((d) => d.month),
            datasets: [
              {
                data: pollutionData.map((d) => d.level),
              },
            ],
          }}
          width={screenWidth - 64}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
        <Text style={{ fontSize: 14, color: "#666", marginTop: 8 }}>
          The decreasing trend in pollution levels demonstrates the
          effectiveness of our cleanup efforts in reducing environmental
          contamination over time.
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "white",
          borderRadius: 10,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 8,
            color: "#333",
          }}
        >
          Long-term Impact on Local Ecosystems
        </Text>
        <ProgressChart
          data={{
            labels: ecosystemImpact.map((d) => d.category),
            data: ecosystemImpact.map((d) => d.score),
          }}
          width={screenWidth - 64}
          height={220}
          chartConfig={chartConfig}
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
        <Text style={{ fontSize: 14, color: "#666", marginTop: 8 }}>
          This chart illustrates the positive impact of our efforts across
          various aspects of the local ecosystem. Higher scores indicate greater
          improvement in each category.
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "white",
          borderRadius: 10,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 8,
            color: "#333",
          }}
        >
          Before and After Comparison
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Image
            source={{ uri: "/api/placeholder/200/150" }}
            style={{
              width: (screenWidth - 80) / 2,
              height: 150,
              borderRadius: 8,
            }}
          />
          <Image
            source={{ uri: "/api/placeholder/200/150" }}
            style={{
              width: (screenWidth - 80) / 2,
              height: 150,
              borderRadius: 8,
            }}
          />
        </View>
        <Text style={{ fontSize: 14, color: "#666" }}>
          These images showcase the visible improvement in beach conditions
          before and after our cleanup efforts. The transformation highlights
          the tangible impact of our work on the local environment.
        </Text>
      </View>

      <View style={{ backgroundColor: "white", borderRadius: 10, padding: 16 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 8,
            color: "#333",
          }}
        >
          Summary
        </Text>
        <Text style={{ fontSize: 14, color: "#666" }}>
          Our environmental impact report demonstrates significant positive
          changes in wildlife protection, pollution reduction, and overall
          ecosystem health. The data shows consistent improvement across all
          measured metrics, indicating that our beach cleaning initiatives are
          making a real difference in preserving and restoring local coastal
          environments.
        </Text>
      </View>
    </ScrollView>
  );
};

export default EnvironmentalImpactReport;
