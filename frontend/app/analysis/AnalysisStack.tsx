import { createStackNavigator } from "@react-navigation/stack";
import AnalysisDashboard from "./AnalysisDashboard";
import EnviromentImpactReport from "./enviroment-impact-report/EnviromentImpactReport";
import EventSummaryReport from "./event-summary-report/EventSummaryReport";
import GeographicImpactReport from "./geographic-impact-report/GeographicImpactReport";
import PerformanceReport from "./performance-report/PerformanceReport";
import TransportEfficencyReport from "./transport-efficency-report/TransportEfficencyReport";
import VolunteerEngagementReport from "./volunteer-engagement-report/VolunteerEngagementReport";
import WasteCompositionReport from "./waste-composition-report/WasteCompositionReport";

const Stack = createStackNavigator();

export const AnalysisStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Analysis Dashboard"
      component={AnalysisDashboard}
      options={{
        // headerShown: false,
        headerTitle: "Analysis Dashboard",
      }}
    />
    <Stack.Screen
      name="Enviroment Impact Report"
      component={EnviromentImpactReport}
      options={{
        headerTitle: "Enviroment Impact Report",
      }}
    />
    <Stack.Screen
      name="Event Summary Report"
      component={EventSummaryReport}
      options={{
        headerTitle: "Event Summary Report",
      }}
    />
    <Stack.Screen
      name="Geographic Impact Report"
      component={GeographicImpactReport}
      options={{
        headerTitle: "Geographic Impact Report",
      }}
    />
    <Stack.Screen
      name="Performance Report"
      component={PerformanceReport}
      options={{
        headerTitle: "Performance Report",
      }}
    />
    <Stack.Screen
      name="Transport Efficency Report"
      component={TransportEfficencyReport}
      options={{
        headerTitle: "Transport Efficency Report",
      }}
    />
    <Stack.Screen
      name="Volunteer Engagement Report"
      component={VolunteerEngagementReport}
      options={{
        headerTitle: "Volunteer Engagement Report",
      }}
    />
    <Stack.Screen
      name="Waste Composition Report"
      component={WasteCompositionReport}
      options={{
        headerTitle: "Waste Composition Report",
      }}
    />
  </Stack.Navigator>
);
