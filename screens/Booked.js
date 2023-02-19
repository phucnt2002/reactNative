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

function Booked(props) {
  const AVATAR_SIZE = 70;
  const SPACING = 20;
  const RADIUS = AVATAR_SIZE / 2;
  const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;
  const [data, setData] = useState([]);
  const { navigation, route } = props;
  const { navigate, goBack } = navigation;
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
  const scrollY = React.useRef(new Animated.Value(0)).current;

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
                    Tên: {item.nameCus}
                  </Text>
                  <Text style={{ fontSize: 16, opacity: 0.7 }}>
                    Tên sân: {item.nameField}
                  </Text>
                  <Text style={{ fontSize: 16, opacity: 0.7 }}>
                    Số điện thoại: {item.phoneCus}
                  </Text>
                  <Text style={{ fontSize: 16, opacity: 0.7 }}>
                    Giá: {item.priceField}
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
