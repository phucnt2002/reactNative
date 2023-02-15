import React, { useState, useEffect, style, useRef } from "react";
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
  SafeAreaView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { images, colors, icons, fontSizes } from "../constants";
import Icon from "react-native-vector-icons/FontAwesome5";
import { isValidEmail, isValidPassword } from "../utilies/Validations";
import { UIHeader } from "../components";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FlatListSan } from "../components";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import Timeline from "react-native-timeline-flatlist";
import Modal from "react-native-modal";
import { LocaleConfig } from "react-native-calendars";
import san from "../data/san";
import CalendarPicker from 'react-native-calendar-picker';
import {
  onAuthStateChanged,
  firebaseDatabaseRef,
  firebaseSet,
  firebaseDatabase,
  auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onValue,
  update
} from "../firebase/firebase";

function Booked(props){
    return
}

export default Booked