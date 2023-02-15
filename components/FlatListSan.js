import {
  FlatList,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableHighlight,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { Text, Image } from "react-native";
import { colors } from "../constants";
import san from "../data/san";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useEffect, useState } from "react";
import UIHeader from "./UIHeader";
import AddSan from "./AddSan";
import DropDownPicker from "react-native-dropdown-picker";
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
import { async } from "@firebase/util";
import dataTime from '../data/dataTime'
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

function FlatListItem(props) {
  const { item, index, deleteItem, onPress } = props;
  const handlerLongClick = () => {
    Alert.alert(
      "Xoa san",
      `Ban chac chan muon xoa san ${item.nameField}?`,
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
  };


  return (
    <Swipeable>
      <TouchableOpacity
        onLongPress={handlerLongClick}
        onPress={onPress}
        style={{
          marginHorizontal: 10,
          marginVertical: 5,
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: index % 2 == 0 ? colors.primary : colors.inactive,
          borderRadius: 10,
        }}
      >
        <Image
          source={{ uri: "https://vecgroup.vn/upload_images/images/2021/12/09/kich-thuoc-san-bong-11-nguoi(1).png" }}
          style={{ width: 100, height: 100, margin: 5 }}
        />
        <View>
          <Text>{`Ten san: ${item.nameField}`}</Text>
          <Text>{`Loai san: ${item.typeField}`}</Text>
          <Text>{`Gia: ${item.priceField}`}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

function FlatListSan(props) {
  props = props.props;
  const responseUser = auth.currentUser;
  let snapshotObject

  const [data, setData] = useState([]);

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
  return (
    <View>
      <UIHeader
        title={"Chon san"}
        leftIconName={"arrow-left"}
        rightIconName={"plus"}
        onPressRightIcon={() => {
          setModalVisible(true);
        }}
      ></UIHeader>
      {/* {nullData ? : <View style={{flex:1, justifyContent: 'center', alignItems: 'center', color: 'black'}}><Text>Chua co du lieu</Text></View>} */}
      <View style={{flex:1}}>
        
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          return (
            <FlatListItem
              item={item}
              index={index}
              deleteItem={deleteItem}
              onPress={() => {
                navigate("Booking", { san: item, index: index });
              }}
            ></FlatListItem>
          );
        }}
      ></FlatList>
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
              placeholder="Ten san"
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
              placeholder="Gia"
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
                <Text style={styles.textStyle}>Save</Text>
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