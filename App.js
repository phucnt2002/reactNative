import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {Login, Main, Register, Settings} from './screens'

export default function App() {
  return (
    // <Login></Login>
    // <Settings></Settings>
    <Main></Main>
    // <Register></Register>
    // <View style={{flex: 1,
    // backgroundColor: 'red'}}><Text></Text></View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
