import React, { useState, useEffect } from "react";
import {Text, View, Image, ImageBackground, TouchableOpacity, TextInput, KeyboardAvoidingView, Keyboard, ScrollView, Button, SafeAreaView, StyleSheet, RefreshControl,
  ActivityIndicator, TouchableWithoutFeedback, Animated} from "react-native";
import { images, colors, icons, fontSizes } from "../constants";
import Icon from "react-native-vector-icons/FontAwesome5";
import { isValidEmail, isValidPassword } from "../utilies/Validations";
import { UIHeader } from "../components";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FlatListSan } from "../components";

import Timeline from 'react-native-timeline-flatlist'

import Modal from "react-native-modal";

function Booking(props) {
  const [date, setDate] = useState(new Date());
  const [modeDate, setModeDate] = useState("date");
  const [modeTimeStart, setModeTimeStart] = useState("time");
  const [modeTimeEnd, setModeTimeEnd] = useState("time");

  const [show, setShow] = useState(false);
  const [text, setText] = useState("Empty");

  const [san, setSan] = useState([
    {
    
    },
  ]);


  const {key, name, type, price, img} = props.route.params.san
  const {navigate, goBack} = props.navigation

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    let tempDate = new Date(currentDate);
    let fDate =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear();
    let fTime =
      "Hours:" + tempDate.getHours() + " |Minutes: " + tempDate.getMinutes();
    setText(fDate + "\n" + fTime);
    console.log(fDate + "(" + fDate + ")");
  };
  const showModeDate = (currentMode) => {
    setShow(true);
    setModeDate(currentMode);
  };

  const onChangeTimeStart = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    let tempDate = new Date(currentDate);
    let fTime = "Hours:" + tempDate.getHours() + " |Minutes: " + tempDate.getMinutes();
  };
  const showModeTimeStart = (currentMode) => {
    //setShow(true);
    setModeTimeStart(currentMode);
  };

  const onChangeTimeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    let tempDate = new Date(currentDate);
    let fTime = "Hours:" + tempDate.getHours() + " |Minutes: " + tempDate.getMinutes();
  };
  const showModeTimeEnd = (currentMode) => {
    //setShow(true);
    setModeTimeEnd(currentMode);
  };

  const data = [
    {time: '9:00', title: 'Event1', description: 'Event1 Description'},
    {time: '10:00', title: 'Event2', description: 'Event2 Description'},
    {time: '11:00', title: 'Event3', description: 'Event3 Description'},
    {time: '12:00', title: 'Event4', description: 'Event4 Description'},
    {time: '13:00', title: 'Event5', description: 'Event5 Description'}
  ]
  
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const handleModal = () => setIsModalVisible(() => !isModalVisible);
 
  
  return (
    
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <UIHeader
        title={name}
        leftIconName={"arrow-left"}
        rightIconName={"ellipsis-v"}
        onPressLeftIcon={()=>{goBack()}}
      ></UIHeader>

      <View style={styles.container}>
        <Timeline 
          style={styles.list}
          data={data}
          separator={true}
          circleSize={20}
          circleColor='rgb(45,156,219)'
          lineColor='rgb(45,156,219)'
          timeStyle={{textAlign: 'center', backgroundColor:'#ff9797', color:'white', padding:5, borderRadius:13, overflow: 'hidden'}}
          descriptionStyle={{color:'gray'}}
          options={{
            style:{paddingTop:5}
          }}
        />
      </View>

      <View style={styles.background}>
        <TouchableOpacity onPress={handleModal} style={styles.containerButton}>
          <Text style={styles.textButton}>Đặt giờ</Text>
          
          <Modal isVisible={isModalVisible}>
            <View style={{ height: 500, backgroundColor: '#fff', borderRadius: 20 }}>
              <View>
                <Button
                  onPress={() => showModeDate("date")}
                  style={{ magrin: "1000" }}
                  title="Date"
                />
              </View>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={modeDate}
                  is24Hour={true}
                  display="default"
                  onChange={onChangeDate}
                />
              )}
              <View>
                <Button
                  onPress={() => showModeTimeStart("time")}
                  style={{ magrin: "1000" }}
                  title="Time Start"
                />
              </View>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={modeTimeStart}
                  is24Hour={true}
                  display="default"
                  onChange={onChangeTimeStart}
                />
              )}
              <View>
                <Button
                  onPress={() => showModeTimeEnd("time")}
                  style={{ magrin: "1000" }}
                  title="Time End"
                />
              </View>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={modeTimeEnd}
                  is24Hour={true}
                  display="default"
                  onChange={onChangeTimeEnd}
                />
              )}


              <Button title="Hide modal" onPress={handleModal} />
            </View>
          </Modal>

        </TouchableOpacity>
       
        </View>
    
    </SafeAreaView>    
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
		backgroundColor:'white'
  },
  background: {
    backgroundColor:'white',
    alignItems: 'center',
  },
  list: {
    flex: 1,
    marginTop:20,
  },
  containerButton: {
    marginVertical: 10,
    height: 30,
    width: 150,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#ff9797'
  },
  textButton: {
    textTransform: 'uppercase',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default Booking 

