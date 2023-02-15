import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Button,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { images, colors, icons, fontSizes } from "../constants";
import Icon from "react-native-vector-icons/FontAwesome5";
import { isValidEmail, isValidPassword } from "../utilies/Validations";
import { UIHeader } from "../components";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FlatListSan } from "../components";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import {
  onAuthStateChanged,
  firebaseDatabaseRef,
  firebaseSet,
  firebaseDatabase,
  auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onValue,
  update,
} from "../firebase/firebase";
function Chart(props) {
  const bookingTableDS = useRef();
  const [labels, setLabels] = useState();
  const [data, setData] = useState();
  const datasets = useRef([
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
  ]);
  const [labelChart, setLabelChart] = useState()
  useEffect(() => {
    onValue(
      firebaseDatabaseRef(firebaseDatabase, "bookingTable"),
      async (snapshot) => {
        if (snapshot.exists()) {
          snapshotObject = snapshot.val();
          bookingTableDS.current = snapshotObject;
          setData(bookingTableDS.current);
          var listTime = [];
          Object.keys(bookingTableDS.current).map((item) => {
            var a = new Date(parseInt(item));
            listTime.push(a.toLocaleDateString("en-US"));
          });
          setLabels(Object.keys(bookingTableDS.current))
          setLabelChart(listTime)
        }
      }
    );
  }, []);
  console.log(labels);
  console.log(datasets);
  // console.log(refLables.current);
  if (labels != undefined) {
    let listPriceDay = []; // price per day
    labels.map((item) => {
      const listDataDay = data[item];
      var sum = listDataDay.reduce(function (a, b) {
        return parseInt(a) + parseInt(b.priceField);
      }, 0);
      listPriceDay.push(sum);
      // listDataDay.map((item)=>console.log(item))
      // listDataDay.push(sum)
    });
    datasets.current = listPriceDay;
    // console.log(listDataDay)
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", margin: 5}}>
      <Text>Bieu do thu nhap</Text>
      <LineChart
        data={{
          labels: labelChart,
          datasets: [
            {
              data: datasets.current,
            },
          ],
        }}
        width={Dimensions.get("window").width*0.9} // from react-native
        height={220}
        // yAxisLabel="$"
        yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726",
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
}
const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};
export default Chart;
