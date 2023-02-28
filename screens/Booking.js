import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  FlatList,
  Pressable,
  Button,
} from "react-native";
import { images, colors, fontSizes } from "../constants";
import { UIHeader } from "../components";
import Modal from "react-native-modal";
import { LocaleConfig } from "react-native-calendars";
import CalendarPicker from "react-native-calendar-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  firebaseDatabaseRef,
  firebaseSet,
  firebaseDatabase,
  auth,
  onValue,
} from "../firebase/firebase";
LocaleConfig.locales["fr"] = {
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthNamesShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  dayNames: [
    "Monday",
    "Tuesday",
    "Wesday",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  dayNamesShort: ["Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun"],
  today: "Today",
};
LocaleConfig.defaultLocale = "fr";
import * as SQLite from "expo-sqlite";

function Booking(props) {
  const {
    FieldAddress,
    FieldID,
    FieldName,
    FieldOwnerID,
    FieldPrice,
    FieldType,
  } = props.route.params.san;
  const index = props.route.params.index;
  const minDate = new Date();
  const responseUser = auth.currentUser;
  const { navigate, goBack } = props.navigation;
  const [data, setData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [nameCus, setNameCus] = useState("");
  const [phoneCus, setPhoneCus] = useState("");
  const [daySelect, setDaySelect] = useState(minDate);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("time");
  const [isShowDatePicker, setIsShowDatePicker] = useState(false)

  const [db, setDb] = useState(SQLite.openDatabase("san.db"));

  const timeChecked = useRef();
  const dataFireBase = useRef();
  const bookingTableDS = useRef();

  const getDataFromDatabase = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM TimeFields WHERE FieldID = ?",
          [FieldID],
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

  const onPressAddTime = () => {
    setIsShowDatePicker(!isShowDatePicker)
  };
  const onPressBooking = () => {};
  const saveOnPress = () => {};

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS TimeFields (FieldID INTEGER, DayBooking TEXT, TimeStart TEXT, TimeEnd TEXT, Price TEXT, Status TEXT)",
        []
      );
    });

    //truy xuat data trong bang TimeFields
    fetchData();
  }, []);

  return (
    <View>
      <UIHeader
        title={FieldName}
        leftIconName={"arrow-left"}
        rightIconName={"plus"}
        onPressLeftIcon={() => {
          goBack();
        }}
        onPressRightIcon={() => {
          onPressAddTime();
        }}
      ></UIHeader>
      <CalendarPicker
        minDate={minDate}
        onDateChange={(date) => {
          setDaySelect(Date.parse(date.toString()));
        }}
      />
      {isShowDatePicker ? (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={() => {}}
        />
      ) : (
        <View />
      )}
      <FlatList
        horizontal={true}
        data={data}
        keyExtractor={(item) => item.key}
        renderItem={({ item, index }) => {
          return item.isBooking != true ? (
            <TouchableOpacity
              onPress={() => {
                console.log(timeChecked.current);
                timeChecked.current = true;
                data.map((item) => {
                  item.isBooking != true
                    ? (item.isBooking = false)
                    : (item.isBooking = item.isBooking);
                });
                data[index].isBooking == null
                  ? (data[index].isBooking = false)
                  : (data[index].isBooking = null);
                const newData = [...data];
                setData(newData);
              }}
              style={{
                padding: 10,
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                opacity: item.isBooking == null ? 0.2 : 1,
              }}
            >
              <Image
                style={{
                  width: 50,
                  height: 50,
                  resizeMode: "cover",
                  borderRadius: 25,
                }}
                source={images.time}
              />
              <Text>{item.time}</Text>
            </TouchableOpacity>
          ) : (
            <View />
          );
        }}
      />
      <View style={{ ustifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#5567C9",
            padding: 15,
            width: Dimensions.get("window").width * 0.8,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
          }}
          onPress={onPressBooking}
        >
          <Text style={{ fontSize: fontSizes.h3, color: "white" }}>
            ĐẶT SÂN
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          console.log("close");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Xác nhận đặt sân</Text>
            <Text>Thông tin khách hàng</Text>
            <TextInput
              onChangeText={(text) => {
                setNameCus(text);
              }}
              style={styles.input}
              placeholder="Tên khách hàng"
              placeholderTextColor={colors.placeholder}
            />
            <TextInput
              onChangeText={(text) => {
                setPhoneCus(text);
              }}
              style={styles.input}
              placeholder="Số điện thoại"
              keyboardType="numeric"
              placeholderTextColor={colors.placeholder}
            />
            <View style={{ flexDirection: "row" }}>
              <Pressable
                style={[styles.button, styles.buttonClose, styles.colorRed]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={saveOnPress}
              >
                <Text style={styles.textStyle}>Booking</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
{
  /* <CalendarList
  // Enable horizontal scrolling, default = false
  horizontal={true}
  // Enable paging on horizontal, default = false
  pagingEnabled={true}
  // Set custom calendarWidth.
  calendarWidth={Dimensions.get('window').width}
  calendarHeight={Dimensions.get('window').height*0.4}
/> */
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "transparent",
  },
  modalView: {
    width: "90%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 40,
    marginHorizontal: 5,
  },
  colorRed: {
    backgroundColor: "red",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "100%",
    borderRadius: 10,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
});
export default Booking;
