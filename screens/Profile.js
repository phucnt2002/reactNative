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
  Animated,
  Dimensions,
  StatusBar
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

export default function Profile() {
  const AVATAR_SIZE = 70;
  const SPACING = 20;
  const RADIUS = AVATAR_SIZE / 2;
  const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [currentTimeStemp, setCurrentTimeStemp] = useState(new Date().getTime())

  const responseUser = auth.currentUser;


  const [data, setData] = useState([]);

  const [db, setDb] = useState(SQLite.openDatabase("san.db"));

  const getDataFromDatabase = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM TimeFields INNER JOIN Fields ON TimeFields.FieldID = Fields.FieldID WHERE FieldOwnerID = ? AND Status = ? AND CAST(DayBooking AS INTEGER) > ?",
          [responseUser.uid, "true", currentTimeStemp],
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

  const fetchData = async () => {
    try {
      const data = await getDataFromDatabase();
      setData(data);
      console.log(data); // xử lý dữ liệu ở đây
    } catch (error) {
      console.log("Lỗi truy vấn cơ sở dữ liệu", error);
    }
  };
  useEffect(() => {
    fetchData()
    console.log(data)
  }, []);
  return (
    <Animated.FlatList
      data={data}
      onScroll={Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: {
                y: scrollY,
              },
            },
          },
        ],
        { useNativeDriver: true } // Add this line
      )}
      keyExtractor={(item) => item.key}
      contentContainerStyle={{
        padding: SPACING,
        paddingTop: StatusBar.currentHeight || 42,
      }}
      renderItem={({ item, index }) => {
        const scale = scrollY.interpolate({
          inputRange: [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 2)],
          outputRange: [1, 1, 1, 0],
        });
        const opacity = scrollY.interpolate({
          inputRange: [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 0.5)],
          outputRange: [1, 1, 1, 0],
        });
        return (
          <Animated.View
            style={{
              flexDirection: "row",
              backgroundColor: "white",
              backgroundColor: "#ededed",
              // padding: SPACING,
              marginBottom: SPACING - 5,
              borderRadius: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 5,
              transform: [{ scale }],
              opacity: opacity,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                width: "100%",
                padding: SPACING,
              }}
              onPress={() => {
              }}
            >
              <Image
                source={{
                  uri: "https://vecgroup.vn/upload_images/images/2021/12/09/kich-thuoc-san-bong-11-nguoi(1).png",
                }}
                style={{ width: 80, height: 60, margin: 5 }}
              />
              <View>
                <Text
                  style={{
                    color: "#5567c9",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    margin: 5,
                  }}
                >{`Tên sân: ${item.FieldName}`}</Text>
                <Text
                  style={{ marginLeft: 5 }}
                >{`Loại sân: ${item.FieldType}`}</Text>
                <Text
                  style={{ marginLeft: 5 }}
                >{`Giá: ${item.FieldPrice}k`}</Text>
                <Text style={{ marginLeft: 5 }}>
                  {`Thoi gian: ${new Date(
                    parseFloat(item.TimeStart)
                  ).toLocaleString()} - ${new Date(
                    parseFloat(item.TimeEnd)
                  ).toLocaleString()}`}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        );
      }}
      showsHorizontalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  text: {
    fontFamily: "HelveticaNeue",
    color: "#52575D",
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginHorizontal: 16,
  },
  subText: {
    fontSize: 12,
    color: "#AEB5BC",
    textTransform: "uppercase",
    fontWeight: "500",
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
  },
  dm: {
    backgroundColor: "#41444B",
    position: "absolute",
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  active: {
    backgroundColor: "#34FFB9",
    position: "absolute",
    bottom: 28,
    left: 10,
    padding: 4,
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  add: {
    backgroundColor: "#41444B",
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 32,
  },
  statsBox: {
    alignItems: "center",
    flex: 1,
  },
  mediaImageContainer: {
    width: 180,
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  mediaCount: {
    backgroundColor: "#41444B",
    position: "absolute",
    top: "50%",
    marginTop: -50,
    marginLeft: 30,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    shadowColor: "rgba(0, 0, 0, 0.38)",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    shadowOpacity: 1,
  },
  recent: {
    marginLeft: 78,
    marginTop: 32,
    marginBottom: 6,
    fontSize: 10,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  activityIndicator: {
    backgroundColor: "#CABFAB",
    padding: 4,
    height: 12,
    width: 12,
    borderRadius: 6,
    marginTop: 3,
    marginRight: 20,
  },
});
