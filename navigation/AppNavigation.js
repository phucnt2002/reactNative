
import React, {Component, useState} from 'react'
import {
    SafeAreaView, 
    Text, 
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    FlatList,
} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StackRouter } from 'react-navigation'
import {Booking, Login, Register, Settings, DetailBooked} from '../screens'

import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
  } from '@react-navigation/drawer'

import UITab from './UITab'
const Stack = createNativeStackNavigator()
function AppNavigation(props) {
    return <NavigationContainer>
        <Stack.Navigator initialRouteName='Login' screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name={"Register"} component={Register}/>
            <Stack.Screen name={"Login"} component={Login}/>
            <Stack.Screen name={"UITab"} component={UITab}/>     
            <Stack.Screen name={"Booking"} component={Booking}/>     
            <Stack.Screen name={"DetailBooked"} component={DetailBooked}/>     
        </Stack.Navigator>
    </NavigationContainer>
}
export default AppNavigation