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
  Button,
  Text,
  Image,
} from "react-native";
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
import dataTime from "../data/dataTime";
import * as ImagePicker from "expo-image-picker";
import * as SQLite from "expo-sqlite";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import Icon from 'react-native-vector-icons/FontAwesome5'


export default function FlatListSan(props) {
  // const { item, index, deleteItem, onPress } = props;
  props = props.props;
  const AVATAR_SIZE = 70;
  const SPACING = 20;
  const RADIUS = AVATAR_SIZE / 2;
  const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const responseUser = auth.currentUser;

  const [db, setDb] = useState(SQLite.openDatabase("san.db"));
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [currentName, setCurrentName] = useState(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Sân 5", value: "Sân 5" },
    { label: "Sân 7", value: "Sân 7" },
    { label: "Sân 9", value: "Sân 9" },
    { label: "Sân 11", value: "Sân 11" },
  ]);

  const [fieldName, setFieldName] = useState();
  const [fieldAddress, setFieldAddress] = useState();
  const [fieldOwnerID, setFieldOwnerID] = useState();
  const [fieldType, setFieldType] = useState(null);
  const [fieldPrice, setFieldPrice] = useState();

  const { navigation, route } = props;
  const { navigate, goBack } = navigation;

  const saveOnPress = () => { };

  const deleteItem = (index) => {
    const field = data[index];
  
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM Fields WHERE FieldID = ?",
        [field.FieldID],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            const newData = [...data];
            newData.splice(index, 1);
            setData(newData);
            console.log(`Field ${field.FieldName} deleted successfully.`);
          }
        },
        (_, error) => {
          console.log("Deletion error:", error);
        }
      );
    });
  };
  

  const exportDb = async () => {
    if (Platform.OS === "android") {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(
          FileSystem.documentDirectory + "SQLite/example.db",
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        );

        await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          "example.db",
          "application/octet-stream"
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
          })
          .catch((e) => console.log(e));
      } else {
        console.log("Permission not granted");
      }
    } else {
      await Sharing.shareAsync(
        FileSystem.documentDirectory + "SQLite/example.db"
      );
    }
  };

  const importDb = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
    });

    if (result.type === "success") {
      setIsLoading(true);

      if (
        !(
          await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite")
        ).exists
      ) {
        await FileSystem.makeDirectoryAsync(
          FileSystem.documentDirectory + "SQLite"
        );
      }

      const base64 = await FileSystem.readAsStringAsync(result.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await FileSystem.writeAsStringAsync(
        FileSystem.documentDirectory + "SQLite/example.db",
        base64,
        { encoding: FileSystem.EncodingType.Base64 }
      );
      await db.closeAsync();
      setDb(SQLite.openDatabase("example.db"));
    }
  };

  const getDataFromDatabase = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM Fields WHERE FieldOwnerID = ?",
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

  useEffect(() => {
    //create table Field and Owners
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS Fields (FieldID INTEGER PRIMARY KEY AUTOINCREMENT, FieldName TEXT, FieldAddress TEXT, FieldOwnerID TEXT, FieldType TEXT, FieldPrice TEXT)",
        []
      );
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS Owners (OwnerID INTEGER PRIMARY KEY AUTOINCREMENT, OwnerName TEXT, OwnerAddress TEXT, OwnerPhone TEXT, OwnerEmail TEXT, OwnerUsername TEXT, OwnerPassword TEXT)",
        []
      );
    });
    fetchData();
    setIsLoading(false);
  }, []);

  const addField = () => {
    setModalVisible(!modalVisible);
    console.log(db);
    db.transaction((tx) => {
      console.log(
        "Inserting field:",
        fieldName,
        fieldAddress,
        fieldOwnerID,
        fieldType,
        fieldPrice
      );
      const ownerId = responseUser.uid ? responseUser.uid : null;

      tx.executeSql(
        "INSERT INTO Fields (FieldName, FieldAddress, FieldOwnerID, FieldType, FieldPrice) VALUES (?, ?, ?, ?, ?)",
        [fieldName, fieldAddress, ownerId, fieldType, fieldPrice],
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

  const deleteName = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM names WHERE id = ?",
        [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingNames = [...names].filter((name) => name.id !== id);
            setData(existingNames);
          }
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  const updateName = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE names SET name = ? WHERE id = ?",
        [currentName, id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingNames = [...names];
            const indexToUpdate = existingNames.findIndex(
              (name) => name.id === id
            );
            existingNames[indexToUpdate].name = currentName;
            setData(existingNames);
            setCurrentName(undefined);
          }
        },
        (txObj, error) => console.log(error)
      );
    });
  };

  const showNames = () => {
    return names.map((name, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text>{name.name}</Text>
          <Button title="Delete" onPress={() => deleteName(name.id)} />
          <Button title="Update" onPress={() => updateName(name.id)} />
        </View>
      );
    });
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
        keyExtractor={(item) => item.key}
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
                backgroundColor: "white",
                backgroundColor: "#ededed",
                // padding: SPACING,
                marginBottom: SPACING - 5,
                borderRadius: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                elevation: 5,
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
                onPress={() => {
                  navigate("Booking", { san: item, index: index });
                }}
              // onLongPress={() => {
              //   Alert.alert(
              //     "Xóa sân",
              //     `Bạn có chắc chắn xóa sân ${item.FieldName}?`,
              //     [
              //       {
              //         text: "No",
              //         onPress: () => console.log("Cancel Pressed"),
              //         style: "cancel",
              //       },
              //       {
              //         text: "Yes",
              //         onPress: () => {
              //           deleteItem(index);
              //         },
              //       },
              //     ],
              //     { cancelable: true }
              //   );
              // }}
              >
                <Image
                  source={{
                    uri: "https://vecgroup.vn/upload_images/images/2021/12/09/kich-thuoc-san-bong-11-nguoi(1).png",
                  }}
                  style={{ width: 80, height: 60, margin: 5 }}
                />
                <View>
                  <Text
                    style={{
                      color: "#5567c9",
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      margin: 5,
                    }}
                  >{`Tên sân: ${item.FieldName}`}</Text>
                  <Text
                    style={{ marginLeft: 5 }}
                  >{`Loại sân: ${item.FieldType}`}</Text>
                  <Text
                    style={{ marginLeft: 5 }}
                  >{`Giá: ${item.FieldPrice}k`}</Text>
                </View>

                <TouchableOpacity style={{ marginLeft: 50 }}
                  onPress={() => {
                    Alert.alert(
                      "Xóa sân",
                      `Bạn có chắc chắn xóa sân ${item.FieldName}?`,
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
                  <Icon name={"trash"} style={{ padding: 10 }} size={20}></Icon>
                </TouchableOpacity>
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
                setFieldName(text);
              }}
              style={styles.input}
              placeholder="Tên sân"
              placeholderTextColor={colors.placeholder}
            />
            <DropDownPicker
              open={open}
              value={fieldType}
              items={items}
              setOpen={setOpen}
              setValue={setFieldType}
              setItems={setItems}
            />
            <TextInput
              onChangeText={(text) => {
                setFieldPrice(text);
              }}
              style={styles.input}
              placeholder="Giá"
              placeholderTextColor={colors.placeholder}
              keyboardType="numeric"
            />
            <TextInput
              onChangeText={(text) => {
                setFieldAddress(text);
              }}
              style={styles.input}
              placeholder="Địa chỉ"
              placeholderTextColor={colors.placeholder}
            />
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <Pressable
                  style={[styles.button, styles.buttonClose, styles.colorRed]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={addField}
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "space-between",
    margin: 8,
  },
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
    backgroundColor: "blue",
    margin: 5,
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
