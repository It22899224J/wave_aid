import { createStackNavigator } from "@react-navigation/stack";
import AdminReportManage from "./admin-report-manage/AdminReportManage";
import AdminReportMain from "./admin-report-main/AdminReportMain";

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
      </Stack.Navigator>
    );
  };