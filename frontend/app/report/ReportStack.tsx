import { createStackNavigator } from "@react-navigation/stack";
import ReportMainView from "./report-screen/ReportMainView";
import ReportAreaPage from "./report-area/ReportAreaPage";
import ReportedAreasPage from "./reported-areas/ReportedAreasPage";
import SelectReportLocation from "./report-area/SelectReportLocation";
import UpdateReportPage from "./update-report/UpdateReportPage";
import UpdateReportLocation from "./update-report/UpdateReportLocation";
import ReportDetailsPage from "./report-details/ReportDetailsPage ";

const Stack = createStackNavigator();

export const ReportStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="ReportMainView"
          component={ReportMainView}
          options={{ headerTitle: "Report", headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="ReportAreaPage"
          component={ReportAreaPage}
          options={{ headerTitle: "Report Area", headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="ReportedAreasPage"
          component={ReportedAreasPage}
          options={{ headerTitle: "Reported Areas", headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="SelectReportLocation"
          component={SelectReportLocation}
          options={{ headerTitle: "Select Report Location", headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="UpdateReportPage"
          component={UpdateReportPage}
          options={{ headerTitle: "Update Report", headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="UpdateReportLocation"
          component={UpdateReportLocation}
          options={{ headerTitle: "Update Report Location", headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="ReportDetailsPage"
          component={ReportDetailsPage}
          options={{ headerTitle: "Report Details", headerTitleAlign: "center" }}
        />
      </Stack.Navigator>
    );
  };