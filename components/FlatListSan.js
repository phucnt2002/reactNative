import { FlatList, View, TouchableOpacity, Alert, Animated } from "react-native";
import { Text, Image } from "react-native";
import { colors } from "../constants";
import san from "../data/san";
import Swipeable from "react-native-gesture-handler/Swipeable";

const RightAction = ({progress, dragX, onPress} ) => {
  const scale = dragX.interpolate({
    inputRange: [-100, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  })
  //console.log("huhu")
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{ backgroundColor: "#dd2c00", justifyContent: "center", alignItems:'flex-end' }}
      >
        <Animated.Text style={[{ color: "#fff", fontWeight: "600",  padding: 20 }, {transform: [{ scale }]}]}>
          Delete
        </Animated.Text>
      </View>
    </TouchableOpacity>
  );
};
function FlatListItem(props) {
  const {item, index} = props
  return (
    <Swipeable 
      renderRightActions={RightAction}
      onPress={onRightPress}
    >
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
      renderItem={({ item }) => {
        <FlatListItem
        {...item}
        //onRightPress={() => alert("Người gì mà dễ thương")}
        ></FlatListItem>
      }}
    ></FlatList>
  );
}

export default FlatListSan;
