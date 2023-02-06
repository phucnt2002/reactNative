import React, {useState, useEffect} from 'react';
import {
    Text, 
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Keyboard,
    ScrollView,
    Button, 
    SafeAreaView
} from 'react-native'
import {images, colors, icons, fontSizes} from '../constants'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {isValidEmail, isValidPassword} from '../utilies/Validations'
import { UIHeader } from '../components';
import DateTimePicker from '@react-native-community/datetimepicker'


function Main(props){
    const [date, setDate] = useState(new Date())
    const [mode, setMode] = useState('date')
    const [show, setShow] = useState(false)
    const [text, setText] = useState('Empty')
  
    const onChange= (event, selectedDate)=>{
      const currentDate = selectedDate || date
      setShow(Platform.OS === 'ios')
      setDate(currentDate)
      let tempDate = new Date(currentDate)
      let fDate = tempDate.getDate()+'/'+(tempDate.getMonth()+1)+'/'+tempDate.getFullYear()
      let fTime = 'Hourse:'+tempDate.getHours()+' |Minutes: '+tempDate.getMinutes()
      setText(fDate+'\n'+fTime)
      console.log(fDate+'('+fDate+')')
    }
    const showMode = (currentMode)=>{
      setShow(true)
      setMode(currentMode)
    }
    return <SafeAreaView style={{
        flex: 1,
    }}>
        <UIHeader title={'Man hinh dat san'}></UIHeader>
        <Text>{text}</Text>

        <View>
            <Button
            onPress={()=>showMode('date')}
            style={{magrin:'1000'}}
            title='Date'
            />
        </View>
        <View>
        <Button
            onPress={()=>showMode('time')}
            style={{magrin:'1000'}}
            title='Time'
            />
        </View>
        {show &&(<DateTimePicker
        testID='dateTimePicker'
        value={date}
        mode={mode}
        is24Hour={true}
        display='default'
        onChange={onChange}
        />)}
    </SafeAreaView>
}
export default Main