import React, { useState, useEffect, style, useRef } from "react";
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
  RefreshControl,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  FlatList,
  Pressable,
} from "react-native";
import { images, colors, icons, fontSizes } from "../constants";
import Icon from "react-native-vector-icons/FontAwesome5";
import { isValidEmail, isValidPassword } from "../utilies/Validations";
import { UIHeader } from "../components";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FlatListSan } from "../components";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import Timeline from "react-native-timeline-flatlist";
import { BookingCalendar } from "react-native-booking-calendar";
import { DateTime } from "luxon";
import Modal from "react-native-modal";
import { LocaleConfig } from "react-native-calendars";
import san from "../data/san";
import {
  onAuthStateChanged,
  firebaseDatabaseRef,
  firebaseSet,
  firebaseDatabase,
  auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
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
function Booking(props) {
  const { key, nameField, typeField, priceField, img, dataTime } =
    props.route.params.san;
  const  index  = props.route.params.index;
  const responseUser = auth.currentUser;
  console.log(responseUser)
  const { navigate, goBack } = props.navigation;
  const [data, setData] = useState(dataTime);
  const [modalVisible, setModalVisible] = useState(false);
  const [nameCus, setNameCus] = useState("");
  const [phoneCus, setPhoneCus] = useState("");

  const dataFireBase = useRef();
  useEffect(() => {
    onValue(
      firebaseDatabaseRef(firebaseDatabase, "field"),
      async (snapshot) => {
        if (snapshot.exists()) {
          snapshotObject = snapshot.val();
          dataFireBase.current = snapshotObject
        }
      }
    );
  }, []);
  const onPressBooking = () => {
    setModalVisible(true);
    setNameCus("")
    setPhoneCus("")
  };

  const saveOnPress = () => {
    if (nameCus == "" || phoneCus == "") {
      alert("Chua dien ten khach hang hoac So dien thoai");
      return;
    } else {
      data.map((item)=>{
        if(item.isBooking==null){
          item.isBooking = true
          item.name = nameCus
          item.phone = phoneCus
          item.timeStamp = Date.now()
        }
      })
      dataFireBase.current[auth.currentUser.uid].san[index].dataTime = data
      console.log(dataFireBase)
      firebaseSet(
        firebaseDatabaseRef(firebaseDatabase, `field`),
        dataFireBase.current
      );
      setModalVisible(false);
      console.log(dataTime);
    }
  };

  console.log("reder");
  return (
    <View>
      <UIHeader
        title={nameField}
        leftIconName={"arrow-left"}
        rightIconName={"ellipsis-v"}
        onPressLeftIcon={() => {
          goBack();
        }}
      ></UIHeader>
      <CalendarList
        onDayPress={day => {
          console.log('selected day', day);
        }}
        // Enable horizontal scrolling, default = false
        horizontal={true}
        // Enable paging on horizontal, default = false
        pagingEnabled={true}
        // Set custom calendarWidth.
        calendarWidth={Dimensions.get("window").width}
        calendarHeight={Dimensions.get("window").height * 0.4}
      />
      {/* <ScrollView>
        <BookingCalendar
          defaultRow={defaultRow}
          startDate={startDate}
          startTime={startTime}
          endTime={endTime}
          intervalMinutes={30}
          dateTime={dateTimeObj}
          backgroundColor="#e0e0e0"
          borderColor="pink"
          fontColor="blue"
        />
      </ScrollView> */}
      <FlatList
        horizontal={true}
        data={data}
        keyExtractor={(item) => item.key}
        renderItem={({ item, index }) => {
          return item.isBooking != true ? (
            <TouchableOpacity
              onPress={() => {
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
                source={{
                  uri: "https://vecgroup.vn/upload_images/images/2021/12/09/kich-thuoc-san-bong-11-nguoi(1).png",
                }}
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
            backgroundColor: colors.primary,
            padding: 15,
            width: Dimensions.get("window").width * 0.8,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
          }}
          onPress={onPressBooking}
        >
          <Text style={{ fontSize: fontSizes.h3, color: "white" }}>
            Booking
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
            <Text>Xac nhan dat san</Text>
            <Text>Thong tin khach hang</Text>
            <TextInput
              onChangeText={(text) => {
                setNameCus(text);
              }}
              style={styles.input}
              placeholder="Ten khach hang"
              placeholderTextColor={colors.placeholder}
            />
            <TextInput
              onChangeText={(text) => {
                setPhoneCus(text);
              }}
              style={styles.input}
              placeholder="So Dien Thoai"
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
