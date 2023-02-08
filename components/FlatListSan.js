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
import { useState } from "react";
import UIHeader from "./UIHeader";
import AddSan from "./AddSan";

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
      "Alert",
      "Are you sure you want to delete?",
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



  const onPressAdd = () => {
    this.refs.AddSan.show;
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
          source={{ uri: item.img }}
          style={{ width: 100, height: 100, margin: 5 }}
        />
        <View>
          <Text>{`Ten san: ${item.name}`}</Text>
          <Text>{`Loai san: ${item.type}`}</Text>
          <Text>{`Gia: ${item.price}`}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

function FlatListSan(props) {
  props = props.props
  const [data, setData] = useState(san);
  console.log(data);

  const deleteItem = (index) => {
    san.splice(index, 1);
    setData([...san]);
    alert(`xoa${index}`);
    console.log(san);
    console.log(data);
  };

  const [modalVisible, setModalVisible] = useState(false);

  const {navigation, route} = props
  const {navigate, goBack} = navigation
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
      <FlatList
        data={san}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          return (
            <FlatListItem
              item={item}
              index={index}
              deleteItem={deleteItem}
              onPress ={() => {
                navigate('Booking', {san: item})
              }}
            ></FlatListItem>
          );
        }}
      ></FlatList>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          console.log("close");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}

              placeholder="Ten san"
              placeholderTextColor={colors.placeholder}
            />
            <TextInput
              style={{
                color: "black",
              }}
              placeholder="Loai san"
              placeholderTextColor={colors.placeholder}
            />
            <TextInput
              style={styles.input}
              placeholder="Gia"
              placeholderTextColor={colors.placeholder}
            />
            <View style={{flexDirection: 'row'}}>
              <Pressable
                style={[styles.button, styles.buttonClose, styles.colorRed]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
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
    width: '80%',
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
    marginHorizontal:5
  },
  colorRed: {
    backgroundColor: 'red'
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
    width: '100%',
    borderRadius: 10
  },
});
export default FlatListSan;
