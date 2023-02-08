/**
yarn add react-navigation
yarn add react-native-safe-area-context
yarn add @react-navigation/bottom-tabs
yarn add @react-navigation/native
yarn add @react-navigation/native-stack
yarn add @react-navigation/drawer
yarn add react-native-gesture-handler 
yarn add react-native-reanimated
 */
import * as React from "react";
import { Settings, Main, Chart } from "../screens";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { fontSizes, colors } from "../constants";
import Icon from "react-native-vector-icons/FontAwesome5";
import "react-native-gesture-handler";
import { View } from "react-native";
const Tab = createBottomTabNavigator();

const screenOptions = ({ route }) => ({
  headerShown: false,
  tabBarActiveTintColor: "white",
  tabBarInactiveTintColor: colors.inactive,
  tabBarActiveBackgroundColor: colors.primary,
  tabBarInactiveBackgroundColor: colors.primary,
  tabBarBackground: () => (
    <View style={{ backgroundColor: colors.primary, flex: 1 }}></View>
  ),
  tabBarIcon: ({ focused, color, size }) => {
    return (
      <Icon
        style={{
          paddingTop: 5,
        }}
        name={
          route.name == "ProductGridView"
            ? "align-center"
            : route.name == "FoodList"
            ? "accusoft"
            : route.name == "Settings"
            ? "cogs"
            : route.name == "Main"
            ? "heart"
            : route.name == "Chart"
            ? "chart-line"
            : ""
        }
        size={23}
        color={focused ? "white" : colors.inactive}
      />
    );
  },
});
function UITab(props) {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name={"Main"}
        component={Main}
        options={{
          tabBarLabel: "Main",
          tabBarLabelStyle: {
            fontSize: fontSizes.h6,
          },
        }}
      />
      <Tab.Screen
        name={"Chart"}
        component={Chart}
        options={{
          tabBarLabel: "Chart",
          tabBarLabelStyle: {
            fontSize: fontSizes.h6,
          },
        }}
      />
      <Tab.Screen
        name={"Settings"}
        component={Settings}
        options={{
          tabBarLabel: "Settings",
          tabBarLabelStyle: {
            fontSize: fontSizes.h6,
          },
        }}
      />
    </Tab.Navigator>
  );
}
export default UITab;
