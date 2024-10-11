import { createStackNavigator } from "@react-navigation/stack";
import AdminReportManage from "./admin-report-manage/AdminReportManage";
import AdminReportMain from "./admin-report-main/AdminReportMain";
import ReportDetailsPage from "@/app/report/report-details/ReportDetailsPage ";

const Stack = createStackNavigator();

export const AdminReportStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="AdminReportMain"
          component={AdminReportMain}
          options={{ headerTitle: "Admin Report", headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="AdminReportManage"
          component={AdminReportManage}
          options={{ headerTitle: "Manage Reports", headerTitleAlign: "center" }}
        />
        <Stack.Screen
            name="AdminReportDetails"
            component={ReportDetailsPage}
            options={{ headerTitle: "Report Details", headerTitleAlign: "center" }}
        />
      </Stack.Navigator>
    );
  };