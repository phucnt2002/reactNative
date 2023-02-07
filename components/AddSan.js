import { FlatList, View, TouchableOpacity, Alert, Dimensions, Platform } from "react-native";
import { Text, Image } from "react-native";
import { colors } from "../constants";
import san from "../data/san";
import { useState } from "react";
import UIHeader from "./UIHeader";
import Model from 'react-native-modalbox'

var screen = Dimensions.get('window')
function AddSan(){
    const showAddModel = ()=>{
        
    }

    return <Model
    style={{
        justifyContent: 'center',
        borderRadius: Platform.OS === 'ios' ? 30 : 0,
        shadowRadius: 10, 
        width: screen.width -80,
        height: 280, 
    }}
    position='center'
    backdrop={true}
    onClosed={()=>{
        alert('close')
    }}
    >
        <Text>Newwwww</Text>
    </Model>
}

export default AddSan