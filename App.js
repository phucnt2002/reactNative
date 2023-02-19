import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View, SafeAreaView } from "react-native";
import { Login, Main, Register, Settings } from "./screens";
import { FlatListSan } from "./components";
import { useState } from "react";
import GlobalStyles from "./GlobalStyles";
import UITag from "./navigation/UITab";
import AppNavigation from "./navigation/AppNavigation";
// import PushNotification from "react-native-push-notification";
// PushNotification.configure({
//   onNotification: function (notification) {
//     console.log("NOTIFICATION:", notification);

//   },
//   requestPermissions: Platform.OS === 'ios'
// });
export default function App() {
  return (
    // <Login></Login>
    // <Settings></Settings>
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      {/* <FlatListSan></FlatListSan> */}
      <AppNavigation></AppNavigation>
    </SafeAreaView>
    // <Register></Register>
    // <View style={{flex: 1,
    // backgroundColor: 'red'}}><Text></Text></View>
  );
}
//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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
