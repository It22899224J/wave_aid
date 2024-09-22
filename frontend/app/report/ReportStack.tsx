import { createStackNavigator } from "@react-navigation/stack";
import ReportMainView from "./report-screen/ReportMainView";
import ReportAreaPage from "./report-area/ReportAreaPage";
import ReportedAreasPage from "./reported-areas/ReportedAreasPage";

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
      </Stack.Navigator>
    );
  };