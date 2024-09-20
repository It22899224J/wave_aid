import { useAuth } from "@/context/AuthContext";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MainScreen from "./events/main-screen/EventsMainView";
import ReportMainView from "./report/report-screen/ReportMainView";
import ReportAreaPage from "./report/report-area/ReportAreaPage";

const Index = () => {
  const { signOut } = useAuth();
  return (
    <>
      <SafeAreaView>
        {/* <Text>This is index</Text>
        <Button title="Signout" onPress={signOut} /> */}
        {/* <MainScreen></MainScreen> */}
        {/* <ReportMainView></ReportMainView> */}
        <ReportAreaPage></ReportAreaPage>
      </SafeAreaView>
    </>
  );
};

export default Index;
