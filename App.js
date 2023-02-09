import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import {Login, Main, Register, Settings} from './screens'
import {FlatListSan} from './components'
import { useState } from 'react';
import GlobalStyles from './GlobalStyles';
import UITag from './navigation/UITab';
import AppNavigation from './navigation/AppNavigation'
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
