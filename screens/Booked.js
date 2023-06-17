  import React, { useState, useEffect, style, useRef } from "react";
  import {
    Text,
    View,
    Image,
    Animated,
    StatusBar,
    TouchableOpacity,
  } from "react-native";
  import { UIHeader } from "../components";
  import {
    firebaseDatabaseRef,
    firebaseDatabase,
    auth,
    onValue,
  } from "../firebase/firebase";
  import * as SQLite from "expo-sqlite";
  import { useFocusEffect } from '@react-navigation/native';


  function Booked(props) {
    const AVATAR_SIZE = 70;
    const SPACING = 20;
    const RADIUS = AVATAR_SIZE / 2;
    const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;
    const [data, setData] = useState([]);
    const { navigation, route } = props;
    const { navigate, goBack } = navigation;
    const responseUser = auth.currentUser;

    const [db, setDb] = useState(SQLite.openDatabase("san.db"));

    const getDataFromDatabase = () => {
      return new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM BookedInfor INNER JOIN TimeFields ON BookedInfor.TimeID = TimeFields.TimeID INNER JOIN Fields ON TimeFields.FieldID = Fields.FieldID WHERE FieldOwnerID = ?",
            [responseUser.uid],
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
    useEffect(() => {
      fetchData()
    }, []);
    const scrollY = React.useRef(new Animated.Value(0)).current;

    const cancelField = (db, timeId, newStatus) => {
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE TimeFields SET Status = ? WHERE TimeID = ?",
          [newStatus, timeId],
          fetchData(),
          (txObj, error) => console.log("Error updating row:", error)
        );
      });
    };

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <UIHeader title="Danh sách sân đã đặt"></UIHeader>
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
          keyExtractor={(item) => {
            item.key;
          }}
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
                  marginBottom: SPACING,
                  backgroundColor: "#ededed",
                  borderRadius: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.3,
                  shadowRadius: 20,
                  elevation: 5,
                  alignItems: "center",
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
                  onPress={() => navigate("DetailBooked", { booked: item})}
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
                    <Text style={{ fontSize: 20, fontWeight: "700" }}>
                      Tên: {item.NameCus}
                    </Text>
                    <Text style={{ fontSize: 16, opacity: 0.7 }}>
                      Tên sân: {item.FieldName}
                    </Text>
                    <Text style={{ fontSize: 16, opacity: 0.7 }}>
                      Số điện thoại: {item.PhoneCus}
                    </Text>
                    <Text style={{ fontSize: 16, opacity: 0.7 }}>
                      Giá: {item.Price}
                    </Text>
                    {/* <Text style={{ fontSize: 16, opacity: 0.7 }}>
                    Thời gian: {item.daySelect}
                  </Text>
                  <Text style={{ fontSize: 16, opacity: 0.7 }}>
                    Khung giờ: {item.timeBooked}
                  </Text> */}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }

  export default Booked;
