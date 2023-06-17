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
  Alert,
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
import Icon from "react-native-fontawesome";

function Item({ item, onPress, selectedId, fetchData }) {
  const [db, setDb] = useState(SQLite.openDatabase("san.db"));
  const isSelected = item.TimeID === selectedId;
  const opacity = isSelected ? 0.3 : 1;

  const deleteRow = (db, timeId) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM TimeFields WHERE TimeID = ?",
        [timeId],
        fetchData(),
        (txObj, error) => console.log("Error deleting row:", error)
      );
    });
  };

  return (
    <TouchableOpacity
      onPress={() => {
        onPress(item.id);
        console.log(item)
      }}
      // onLongPress={() => {
      //   Alert.alert(
      //     "Xóa sân",
      //     `Bạn có chắc chắn xóa sân ${item.nameField}?`,
      //     [
      //       {
      //         text: "No",
      //         onPress: () => console.log("Cancel Pressed"),
      //         style: "cancel",
      //       },
      //       {
      //         text: "Yes",
      //         onPress: () => {
      //           deleteRow(db, item.TimeID);
      //         },
      //       },
      //     ],
      //     { cancelable: true }
      //   );
      // }}
      style={{
        // backgroundColor: 'red',
        padding: 10,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        opacity: opacity,
      }}
    >
      <Image
        style={{
          width: 50,
          height: 50,
          resizeMode: "cover",
          borderRadius: 25,
        }}
        source={{
          uri: "https://vecgroup.vn/upload_images/images/2021/12/09/kich-thuoc-san-bong-11-nguoi(1).png",
        }}
      />
      <Text>{`${new Date(Number(item.TimeStart)).getHours()}:${new Date(
        Number(item.TimeStart)
      ).getMinutes()} - ${new Date(Number(item.TimeEnd)).getHours()}:${new Date(
        Number(item.TimeEnd)
      ).getMinutes()}`}</Text>
    </TouchableOpacity>
  );
}

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

  const [daySelect, setDaySelect] = useState(new Date(minDate).getTime());
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("time");
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);

  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [timeStart, setTimeStart] = useState(null);
  const [timeEnd, setTimeEnd] = useState(null);
  const [price, setPrice] = useState("");
  const [avaiable, setavaiable] = useState(true);

  const [db, setDb] = useState(SQLite.openDatabase("san.db"));

  const timeChecked = useRef();
  const dataFireBase = useRef();
  const bookingTableDS = useRef();

  const [selectedId, setSelectedId] = useState(null);

  var timeStart_ = new Date(timeStart).toLocaleDateString()
  const getDataFromDatabase = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM TimeFields WHERE FieldID = ? AND DayBooking = ? AND Status = ?",
          [FieldID, daySelect + "", "true"],
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
    setModalAddVisible(!modalAddVisible);
    setTimeStart(null);
    setTimeEnd(null);
  };

  const updateStatus = (db, timeId, newStatus) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE TimeFields SET Status = ? WHERE TimeID = ?",
        [newStatus, timeId],
        fetchData(),
        (txObj, error) => console.log("Error updating row:", error)
      );
    });
  };

  const onChangePickTime = (event, selectedDate) => {
    //click ok in calendar
    console.log(Date(selectedDate).toString(), Date(date).toString());
    const currentDate = selectedDate || date;
    const timeStemp = Date.parse(currentDate) + "";
    timeStart ? setTimeEnd(timeStemp) : setTimeStart(timeStemp);
    console.log(`start ${timeStart}`)
    console.log(`end ${timeEnd}`)
    setIsShowDatePicker(!isShowDatePicker);
  };

  const onPressBooking = () => {
    //Function Booking
    if (selectedId) {
      setModalVisible(!modalVisible);
      //
    } else {
      alert("Chua chon thoi gian");
      return;
    }
  };
  const saveOnPress = () => {
    if (nameCus == "" || phoneCus == "") {
      alert(`Dien lai ten hoac SDT`);
    } else {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO BookedInfor (TimeID, FieldID , NameCus , PhoneCus ) VALUES (? ,?, ?, ?)",
          [selectedId, FieldID, nameCus, phoneCus],
          (_, { rowsAffected }) => {
            console.log("Insertion result:", rowsAffected);
            if (rowsAffected > 0) {
              console.log("Dat san thanh cong.");
            } else {
              console.log("Không thể thêm sân vào cơ sở dữ liệu.");
            }
          },
          (_, error) => {
            console.log("Insertion error:", error);
          }
        );
      });
      updateStatus(db, selectedId, "false");
      setModalVisible(!modalVisible);
    }
  };
  const saveTimeDb = () => {
    if (
      timeEnd == null ||
      timeStart == null ||
      parseFloat(timeEnd) <= parseFloat(timeStart)
    ) {
      alert(`Chon thoi gian khong hop li`);
      return;
    }
    setModalAddVisible(!modalAddVisible);
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO TimeFields (FieldID, DayBooking, TimeStart, TimeEnd, Price, Status) VALUES (?, ?, ?, ?, ?, ?)",
        [FieldID, daySelect + "", timeStart, timeEnd, FieldPrice, "true"],
        (_, { rowsAffected }) => {
          console.log("Insertion result:", rowsAffected);
          if (rowsAffected > 0) {
            console.log("Sân đã được thêm vào cơ sở dữ liệu.");
            fetchData();
          } else {
            console.log("Không thể thêm sân vào cơ sở dữ liệu.");
          }
        },
        (_, error) => {
          console.log("Insertion error:", error);
        }
      );
    });
  };

  const renderItem = ({ item }) => {
    return (
      <Item
        item={item}
        onPress={(id) => setSelectedId(item.TimeID)}
        selectedId={selectedId}
        fetchData={fetchData}
      />
    );
  };

  useEffect(() => {
    console.log(daySelect);
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS TimeFields (TimeID INTEGER PRIMARY KEY AUTOINCREMENT, FieldID INTEGER, DayBooking TEXT, TimeStart TEXT, TimeEnd TEXT, Price TEXT, Status TEXT)",
        []
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS BookedInfor (BookedID INTEGER PRIMARY KEY AUTOINCREMENT, TimeID INTEGER, FieldID INTEGER, NameCus TEXT, PhoneCus TEXT)",
        []
      );
    });

    // const sql = 'DROP TABLE IF EXISTS TimeFields';
    // db.transaction(tx => {
    //   tx.executeSql(sql);
    // });

    //truy xuat data trong bang TimeFields
    fetchData();
    console.log(data);
  }, [daySelect]);

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
          // setDaySelect(date.toString())
          // setDaySelect(Date.parse(date.toString()));
          console.log(date);
          console.log(new Date(date).getTime());
          setDaySelect(new Date(date).getTime());
        }}
      />
      {isShowDatePicker ? (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChangePickTime}
        />
      ) : (
        <View />
      )}
      <FlatList
        horizontal={true}
        data={data}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        extraData={selectedId}
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
        visible={modalAddVisible}
        onRequestClose={() => {
          console.log("close");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose, { margin: 10 }]}
              onPress={() => {
                setTimeStart(null);
                setIsShowDatePicker(!isShowDatePicker);
              }}
            >
              <Text>Chon gio bat dau</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setTimeEnd(null);
                setIsShowDatePicker(!isShowDatePicker);
              }}
            >
              <Text>Chon gio ket thuc</Text>
            </TouchableOpacity>
            {/* <Text>{`start ${timeStart} end ${timeEnd}`}</Text> */}
            <View style={{ flexDirection: "row" }}>
              <Pressable
                style={[styles.button, styles.buttonClose, styles.colorRed]}
                onPress={() => setModalAddVisible(!modalAddVisible)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={saveTimeDb}
              >
                <Text style={styles.textStyle}>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

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
