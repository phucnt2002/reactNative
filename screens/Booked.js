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
  Alert,
  StatusBar,
} from "react-native";
import { images, colors, icons, fontSizes } from "../constants";
import Icon from "react-native-vector-icons/FontAwesome5";
import { isValidEmail, isValidPassword } from "../utilies/Validations";
import { UIHeader } from "../components";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FlatListSan } from "../components";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import Timeline from "react-native-timeline-flatlist";
import Modal from "react-native-modal";
import { LocaleConfig } from "react-native-calendars";
import san from "../data/san";
import CalendarPicker from "react-native-calendar-picker";
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

function Booked(props) {
  const AVATAR_SIZE = 70;
  const SPACING = 20;
  const RADIUS = AVATAR_SIZE / 2;
  const ITEM_SIZE = AVATAR_SIZE + SPACING *3
  const [data, setData] = useState([]);
  useEffect(() => {
    onValue(
      firebaseDatabaseRef(firebaseDatabase, "bookingTable"),
      async (snapshot) => {
        if (snapshot.exists()) {
          snapshotObject = snapshot.val();
          console.log(Object.keys(snapshotObject[auth.currentUser.uid]));

          var array = Object.keys(snapshotObject[auth.currentUser.uid]).map(
            function (key) {
              return snapshotObject[auth.currentUser.uid][key];
            }
          );
          var listBooked = [];
          array = array.map((item) => {
            item.map((i) => {
              listBooked.push(i);
            });
            return [...item];
          });
          setData(listBooked);
          // setData(snapshotObject[auth.currentUser.uid]);
        }
      }
    );
  }, []);
  const scrollY = React.useRef(new Animated.Value(0)).current

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Animated.FlatList
        data={data}
        onScroll={Animated.event([
          {
            nativeEvent: {
              contentOffset: {
                y: scrollY
              }
            }
          }
        ], 
         { useNativeDriver: true } // Add this line
        )}
        keyExtractor={(item) => {
          item.key;
        }}
        contentContainerStyle={{
          padding: SPACING,
          paddingTop: StatusBar.currentHeight || 42,
        }}
        renderItem={({ item, index }) => {
          const scale = scrollY.interpolate({
                      inputRange: [
                        -1, 0,
                        ITEM_SIZE * index,
                        ITEM_SIZE * (index + 2)
                      ],
                      outputRange: [1, 1, 1, 0]
                    })
                    const opacity = scrollY.interpolate({
                      inputRange: [
                        -1, 0,
                        ITEM_SIZE * index,
                        ITEM_SIZE * (index + 0.5)
                      ],
                      outputRange: [1, 1, 1, 0]
                    })
          return (
            <Animated.View
              style={{
                flexDirection: "row",
                padding: SPACING,
                marginBottom: SPACING,
                backgroundColor: "#ededed",
                borderRadius: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                elevation: 5,
                transform: [{scale}],
                opacity: opacity
              }}
              // style={{
              //   marginHorizontal: 10,
              //   marginVertical: 5,
              //   flex: 1,
              //   flexDirection: "row",
              //   alignItems: "center",
              //   backgroundColor:'#8d9ac5',
              //   borderRadius: 10,
              //   shadowColor: "#000",
              //   shadowOffset: {
              //     width: 0,
              //     height: 2,
              //   },
              //   shadowOpacity: 0.25,
              //   shadowRadius: 4,
              //   elevation: 5,
              // }}
            >
              <Image
                source={{
                  uri: "https://noithatbinhminh.com.vn/wp-content/uploads/2022/08/anh-dep-40.jpg",
                }}
                style={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  borderRadius: RADIUS,
                  marginRight: SPACING / 2,
                }}
              />
              <View>
                <Text style={{ fontSize: 22, fontWeight: "700" }}>
                  {item.nameCus}
                </Text>
                <Text style={{ fontSize: 18, opacity: 0.7 }}>
                  {item.nameField}
                </Text>
                <Text style={{ fontSize: 18, opacity: 0.7 }}>
                  {item.phoneCus}
                </Text>
                <Text style={{ fontSize: 18, opacity: 0.7 }}>
                  {item.priceField}
                </Text>
              </View>
            </Animated.View>
          );
        }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

export default Booked;
