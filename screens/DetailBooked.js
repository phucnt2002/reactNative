import { UIHeader } from "../components";

import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  Pressable,
  Button,
  ImageBackground,
  ScrollView,
  StyleSheet,
} from "react-native";
function DetailBooked(props) {
  const booked = props.route.params.booked;
  const { navigate, goBack } = props.navigation;

  const daySelect = new Date(parseFloat(booked.daySelect)).toLocaleDateString(
    "en-US"
  );
  return (
    <View style={{ flex: 1 }}>
      <UIHeader
        title={booked.nameField}
        leftIconName={"arrow-left"}
        //rightIconName={"ellipsis-v"}
        onPressLeftIcon={() => {
          goBack();
        }}
      />
      <ImageBackground
        source={{
          uri: "https://images.elipsport.vn/news/2020/11/7/co-san-bong-da-quoc-te-la-co-gi.1604710995.jpg",
        }}
        resizeMode="cover"
        style={{ flex: 1 }}
        blurRadius={2}
      >
        <View style={{ alignSelf: "center", marginBottom: 20 }}>
          <View style={styles.profileImage}>
            <Image
              source={{
                uri: "https://noithatbinhminh.com.vn/wp-content/uploads/2022/08/anh-dep-40.jpg",
              }}
              style={{ height: 200, width: 200, borderRadius: 100 }}
              resizeMode="center"
            ></Image>
          </View>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.mediaImageContainer}>
            <Image
              source={{
                uri: "https://co-nhan-tao.com/wp-content/uploads/2021/12/co-nhan-tao-san-bong-chuyen-1-768x1024.jpg",
              }}
              style={styles.image}
              resizeMode="cover"
            ></Image>
          </View>
          <View style={styles.mediaImageContainer}>
            <Image
              source={{
                uri: "https://co-nhan-tao.com/wp-content/uploads/2021/12/co-nhan-tao-san-bong-chuyen-1-768x1024.jpg",
              }}
              style={styles.image}
              resizeMode="cover"
            ></Image>
          </View>
          <View style={styles.mediaImageContainer}>
            <Image
              source={{
                uri: "https://co-nhan-tao.com/wp-content/uploads/2021/12/co-nhan-tao-san-bong-chuyen-1-768x1024.jpg",
              }}
              style={styles.image}
              resizeMode="cover"
            ></Image>
          </View>
        </ScrollView>
        <View
          style={{
            height: 250,
            margin: 20,
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            borderRadius: 20,
            padding: 20
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "700", marginVertical: 10 }}>
            Tên khách hàng: {booked.nameCus}
          </Text>
          <Text
            style={{
              fontSize: 16,
              opacity: 0.7,
              marginVertical: 10,
              marginHorizontal: 15,
            }}
          >
            Tên sân: {booked.nameField}
          </Text>
          <Text
            style={{
              fontSize: 16,
              opacity: 0.7,
              marginVertical: 10,
              marginHorizontal: 15,
            }}
          >
            Số điện thoại: {booked.phoneCus}
          </Text>
          <Text
            style={{
              fontSize: 16,
              opacity: 0.7,
              marginVertical: 10,
              marginHorizontal: 15,
            }}
          >
            Giá: {booked.priceField + "000VND"}
          </Text>
          <Text
            style={{
              fontSize: 16,
              opacity: 0.7,
              marginVertical: 10,
              marginHorizontal: 15,
            }}
          >
            Ngày: {daySelect}
          </Text>
        </View>
      </ImageBackground>
    </View>
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
export default DetailBooked;
