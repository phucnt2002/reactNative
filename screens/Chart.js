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
const chartConfigs = [
  {
    backgroundColor: "#000000",
    backgroundGradientFrom: "#1E2923",
    backgroundGradientTo: "#08130D",
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  },
  {
    backgroundColor: "#022173",
    backgroundGradientFrom: "#022173",
    backgroundGradientTo: "#1b3fa0",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeDasharray: "", // solid background lines with no dashes
    },
  },
  {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  },
  {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  },
  {
    backgroundColor: "#26872a",
    backgroundGradientFrom: "#43a047",
    backgroundGradientTo: "#66bb6a",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  },
  {
    backgroundColor: "#000000",
    backgroundGradientFrom: "#000000",
    backgroundGradientTo: "#000000",
    color: (opacity = 1) => `rgba(${255}, ${255}, ${255}, ${opacity})`,
  },
  {
    backgroundColor: "#0091EA",
    backgroundGradientFrom: "#0091EA",
    backgroundGradientTo: "#0091EA",
    color: (opacity = 1) => `rgba(${255}, ${255}, ${255}, ${opacity})`,
  },
  {
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  },
  {
    backgroundColor: "#b90602",
    backgroundGradientFrom: "#e53935",
    backgroundGradientTo: "#ef5350",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  },
  {
    backgroundColor: "#ff3e03",
    backgroundGradientFrom: "#ff3e03",
    backgroundGradientTo: "#ff3e03",
    color: (opacity = 1) => `rgba(${0}, ${0}, ${0}, ${opacity})`,
  },
];
function Chart(props) {
  // const userID = auth.currentUser.uid;
  const bookingTableDS = useRef();
  const [labels, setLabels] = useState();
  const [data, setData] = useState();
  const datasets = useRef();
  const [labelChart, setLabelChart] = useState();
  useEffect(() => {
    onValue(
      firebaseDatabaseRef(firebaseDatabase, "bookingTable"),
      async (snapshot) => {
        if (snapshot.exists()) {
          snapshotObject = snapshot.val();
          bookingTableDS.current = snapshotObject[auth.currentUser.uid];
          setData(bookingTableDS.current);
          var listTime = [];
          var arr = Object.keys(bookingTableDS.current);
          arr.sort((a, b)=>{
            parseFloat(a) - parseFloat(b)
          })
          arr.map((item) => {
            var a = new Date(parseInt(item));
            // listTime.push(a.toLocaleDateString("en-US"));
            listTime.push(a.getDate()+"/"+(a.getMonth()+1));
          });
          setLabels(arr);
          setLabelChart(listTime);
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

  const dataChart = {
    labels: labelChart,
    datasets: [
      {
        data: datasets.current,
      },
    ],
  };
  console.log(datasets.current);
  const graphStyle = {
    marginVertical: 8,
    ...chartConfig.style,
  };
  return datasets.current != undefined ? (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#3adebf'
      }}
    >
      <Text style={{fontSize: fontSizes.h3, fontWeight: '700', color: 'white', marginBottom: 20}}>Biểu đồ thu nhập</Text>
      <LineChart
        data={dataChart}
        width={Dimensions.get("window").width * 0.9} // from react-native
        height={220}
        // yAxisLabel="$"
        yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 0, // optional, defaults to 2dp
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
      <BarChart
        data={dataChart}
        width={Dimensions.get("window").width * 0.9}
        height={300}
        yAxisSuffix="k"
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#42bfff",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#f880ff",
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        verticalLabelRotation={30}
      />
    </View>
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
      }}
    >
      <Text>Chua co du lieu</Text>
    </View>
  );
}
const chartConfig = {
  backgroundColor: "#e26a00",

  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};
export default Chart;
