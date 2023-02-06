import { FlatList, View, TouchableOpacity, Alert } from "react-native";
import { Text, Image } from "react-native";
import { colors } from "../constants";
import san from "../data/san";
import Swipeable from "react-native-gesture-handler/Swipeable";

const LeftAction = () => {
  console.log("huhu")
  return (
    <View
      style={{ backgroundColor: "#388e3c", justifyContent: "center", flex: 1 }}
    >
      <Text style={{ color: "#fff", fontWeight: "600", padding: 20 }}>
        Delete
      </Text>
    </View>
  );
};

function FlatListItem(props) {
  const {item, index} = props
  return (
    <Swipeable renderRightActions={LeftAction}>
      <View
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
      </View>
    </Swipeable>
  );
}

function FlatListSan() {
  return (
    <FlatList
      data={san}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => {
        return <FlatListItem item={item} index={index}></FlatListItem>
      }}
    ></FlatList>
  );
}

export default FlatListSan;
