import {
  View,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Pressable,
  StyleSheet,
  Animated,
  StatusBar,
  Button
} from "react-native";
import { Text, Image } from "react-native";
import { colors } from "../constants";
import React, { useEffect, useState } from "react";
import UIHeader from "./UIHeader";
import DropDownPicker from "react-native-dropdown-picker";
import {
  firebaseDatabaseRef,
  firebaseSet,
  firebaseDatabase,
  auth,
  onValue,
} from "../firebase/firebase";
import dataTime from '../data/dataTime'
import * as ImagePicker from 'expo-image-picker';

// const LeftAction = () => {
//   console.log("huhu")
//   return (
//     <View
//       style={{ backgroundColor: "#388e3c", justifyContent: "center", flex: 1 }}
//     >
//       <Text style={{ color: "#fff", fontWeight: "600", padding: 20 }}>
//         Delete
//       </Text>
//     </View>
//   );
// };

function FlatListSan(props) {
  const AVATAR_SIZE = 70;
  const SPACING = 20;
  const RADIUS = AVATAR_SIZE / 2;
  const ITEM_SIZE = AVATAR_SIZE + SPACING *3
  const scrollY = React.useRef(new Animated.Value(0)).current

  props = props.props;
  const responseUser = auth.currentUser;
  let snapshotObject

  const [data, setData] = useState([]);
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Sân 5", value: "Sân 5" },
    { label: "Sân 7", value: "Sân 7" },
    { label: "Sân 9", value: "Sân 9" },
    { label: "Sân 11", value: "Sân 11" },
  ]);
  const [nameField, setNameField] = useState("");
  const [priceField, setPriceField] = useState("");
  const [nullData, setNullData] = useState(true);
  const deleteItem = (index) => {
    data.splice(index, 1);
    setData(data);
    if (responseUser) {
      let user = {
        userID: responseUser.uid,
        san: data,
      };
      firebaseSet(
        firebaseDatabaseRef(firebaseDatabase, `field/${responseUser.uid}`),
        user
      );
    }
  };

  const saveOnPress = () => {
    setModalVisible(!modalVisible);
    if (responseUser) {
      try{
        let user = {
          userID: responseUser.uid,
          timeNow: Date.now(),
          san: [...data, {
            nameField: nameField,
            typeField: value,
            priceField: priceField,
            dataTime
          }],
        };
        firebaseSet(
          firebaseDatabaseRef(firebaseDatabase, `field/${responseUser.uid}`),
          user
        );
      }catch{
        let user = {
          userID: responseUser.uid,
          timeNow: Date.now(),
          san: [{
            nameField: nameField,
            typeField: value,
            priceField: priceField,
            dataTime
          }],
        };
        firebaseSet(
          firebaseDatabaseRef(firebaseDatabase, `field/${responseUser.uid}`),
          user
        );
      }
    }

    // onAuthStateChanged(auth, (responseUser) => {
    //   debugger;
    //   if (responseUser) {
    //     let user = {
    //       userID: responseUser.uid,
    //       san: {
    //         nameField: nameField,
    //         typeField: value,
    //         priceField: priceField,
    //       },
    //     };
    //     firebaseSet(
    //       firebaseDatabaseRef(firebaseDatabase, `field/${responseUser.uid}`),
    //       user
    //     );
    //   }
    // });
  };
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    onValue(
      firebaseDatabaseRef(firebaseDatabase, "field"),
      async (snapshot) => {
        if (snapshot.exists()) {
          snapshotObject = snapshot.val();
          const currentUser = responseUser.uid;
          const dataCurrent = snapshotObject[currentUser]
          setData(dataCurrent.san)
        }
      }
    );

  }, []);

    const { navigation, route } = props;
    const { navigate, goBack } = navigation;
    console.log("render")
    
    // function FlatListItem(props) {
    //   const { item, index, deleteItem, onPress } = props;
    //   const handlerLongClick = () => {
        
    //   };
    // }
    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };
  return (
    <View>
      <UIHeader
        title={"Danh sách sân bóng"}
        //leftIconName={"arrow-left"}
        rightIconName={"plus"}
        onPressRightIcon={() => {
          setModalVisible(true);
        }}
      ></UIHeader>
      {/* {nullData ? : <View style={{flex:1, justifyContent: 'center', alignItems: 'center', color: 'black'}}><Text>Chua co du lieu</Text></View>} */}
      <View style={{flex:1}}>
        
      </View>
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
        keyExtractor={(item) => item.key}
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
                marginBottom: SPACING - 5,
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
              // item={item}
              // index={index}
              // deleteItem={deleteItem}
            >
                <TouchableOpacity
                style={{
                  flexDirection: 'row'
                }}
                onPress={() => {
                  navigate("Booking", { san: item, index: index });
                }}
                  onLongPress = {() => {
                    Alert.alert(
                      "Xóa sân",
                      `Bạn có chắc chắn xóa sân ${item.nameField}?`,
                      [
                        {
                          text: "No",
                          onPress: () => console.log("Cancel Pressed"),
                          style: "cancel",
                        },
                        {
                          text: "Yes",
                          onPress: () => {
                            deleteItem(index);
                          },
                        },
                      ],
                      { cancelable: true }
                    );
                  }}
                >
                  <Image
                    source={{ uri: "https://vecgroup.vn/upload_images/images/2021/12/09/kich-thuoc-san-bong-11-nguoi(1).png" }}
                    style={{ width: 80, height: 60, margin: 5 }}
                  />
                  <View>
                    <Text style={{color: '#5567c9', textTransform: 'uppercase', fontWeight: 'bold', margin: 5}}>{`Tên sân: ${item.nameField}`}</Text>
                    <Text style={{marginLeft: 5}}>{`Loại sân: ${item.typeField}`}</Text>
                    <Text style={{marginLeft: 5}}>{`Giá: ${item.priceField}k`}</Text>
                  </View>
                </TouchableOpacity>
            </Animated.View>
          );
        }}
        showsHorizontalScrollIndicator={false}
      />
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
            <TextInput
              onChangeText={(text) => {
                setNameField(text);
              }}
              style={styles.input}
              placeholder="Tên sân"
              placeholderTextColor={colors.placeholder}
            />
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
            />
            <TextInput
              onChangeText={(text) => {
                setPriceField(text);
              }}
              style={styles.input}
              placeholder="Giá"
              placeholderTextColor={colors.placeholder}
              keyboardType="numeric"
            />
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
              <Pressable style={[ styles.button, styles.buttonClose ]} 
              title="Choose Image"
              onPress={pickImage} >
                <Text style={styles.textStyle}>Choose Image</Text>
              </Pressable>

              <View style={{ flexDirection: "row", marginTop: 5 }}>
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
                  <Text style={styles.textStyle}>Save</Text>
                </Pressable>
              </View>
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
    width: "80%",
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
    backgroundColor: 'blue',
    margin: 5
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
});
export default FlatListSan;