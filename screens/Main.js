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
    Button
} from 'react-native'
import {images, colors, icons, fontSizes} from '../constants'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {isValidEmail, isValidPassword} from '../utilies/Validations'

function Main(props){
    return <View style={{
        flex: 1,
        backgroundColor: 'red',
        justifyContent: 'center'
    }}>
        <Button
        style={{magrin:'1000'}}
        title='aa'
        >
        </Button>
    </View>
}
export default Main