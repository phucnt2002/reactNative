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
import * as SQLite from "expo-sqlite";

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
import { useFocusEffect } from '@react-navigation/native';

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
  const [datasets, setDatasets] = useState();
  const [labelChart, setLabelChart] = useState();
  const [db, setDb] = useState(SQLite.openDatabase("san.db"));
  const responseUser = auth.currentUser;
  

  useFocusEffect(
    React.useCallback(() => {
      // Code to be run when the screen receives focus for the second time
      console.log('Main screen received focus');
      fetchData();
      // ...

      return () => {
        // Code to be run when the screen loses focus
        console.log('Main screen lost focus');
        // ...
      };
    }, [])
  );

  const fetchData = async () => {
    try {
      const data = await getDataFromDatabase();
      console.log(data); // Check if the data is fetched correctly
  
      // Process the data
      const processedData = processChartData(data); // Define a function to process the data
  
      // Set the processed data as the chart data
      setData(processedData);
  
      // Update the labels and datasets
      const labels = processedData.map((item) => item.label);
      const datasets = [
        {
          data: processedData.map((item) => item.value),
        },
      ];
      setLabels(labels);
      setDatasets(datasets);
    } catch (error) {
      console.log("Lỗi truy vấn cơ sở dữ liệu", error);
    }
  };

  const processChartData = (data) => {
    const chartData = [];
  
    // Create an object to store the accumulated price for each date
    const accumulatedData = {};
  
    // Iterate over the data array
    for (const item of data) {
      const date = new Date(parseInt(item.DayBooking)).toLocaleDateString();
      const price = parseFloat(item.Price);
  
      // Check if the date already exists in the accumulatedData object
      if (accumulatedData[date]) {
        // If the date exists, add the price to the accumulated value
        accumulatedData[date] += price;
      } else {
        // If the date doesn't exist, initialize it with the current price
        accumulatedData[date] = price;
      }
    }
  
    // Iterate over the accumulatedData object and create chart data
    for (const date in accumulatedData) {
      const label = date;
      const value = accumulatedData[date];
      chartData.push({ label, value });
    }
  
    return chartData;
  };
  

  const getDataFromDatabase = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM Fields inner join TimeFields on Fields.FieldID = TimeFields.FieldID  WHERE Fields.FieldOwnerID = ? and TimeFields.Status = ? ORDER BY TimeFields.TimeStart",
          [responseUser.uid, "false"],
          (_, { rows: { _array } }) => {
            resolve(_array);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  };

  useEffect(() => {
    // onValue(
    //   firebaseDatabaseRef(firebaseDatabase, "bookingTable"),
    //   async (snapshot) => {
    //     if (snapshot.exists()) {
    //       snapshotObject = snapshot.val();
    //       bookingTableDS.current = snapshotObject[auth.currentUser.uid];
    //       setData(bookingTableDS.current);
    //       var listTime = [];
    //       var arr = Object.keys(bookingTableDS.current);
    //       arr.sort((a, b)=>{
    //         parseFloat(a) - parseFloat(b)
    //       })
    //       arr.map((item) => {
    //         var a = new Date(parseInt(item));
    //         listTime.push(a.getDate()+"/"+(a.getMonth()+1));
    //       });
    //       setLabels(arr);
    //       setLabelChart(listTime);
    //     }
    //   }
    // );
  }, []);


  const dataChart = {
    labels: labels,
    datasets: datasets,
  };

  console.log(dataChart)

  const graphStyle = {
    marginVertical: 8,
    ...chartConfig.style,
  };
  return datasets != undefined ? (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#ededed'
      }}
    >
      <Text style={{fontSize: fontSizes.h3, fontWeight: '700', color: 'black', marginBottom: 20}}>Biểu đồ thu nhập</Text>
      <LineChart
        data={dataChart}
        width={Dimensions.get("window").width * 0.9} // from react-native
        height={220}
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
            borderRadius: 10,
            
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "white",
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 10,
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
          borderRadius: 10,
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
