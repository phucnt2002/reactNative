import { initializeApp } from 'firebase/app'
import { 
    getAuth, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,   
    signInWithEmailAndPassword,
    sendEmailVerification,
    //read data from Firebase    
} from "firebase/auth"
//ref = reference to a "collection"
import { 
    getDatabase, 
    ref as firebaseDatabaseRef, 
    set as firebaseSet,
    child,
    get,
    onValue,
} from "firebase/database"
const firebaseConfig = {
    apiKey: "AIzaSyBMIZflVVCTAQaWDtq8Pf3fof7v2ArRce0",
    authDomain: "reactnative-24876.firebaseapp.com",
    databaseURL: "https://reactnative-24876-default-rtdb.asia-southeast1.firebasedatabase.app",
    
    projectId: "reactnative-24876",
    storageBucket: "reactnative-24876.appspot.com",
    appId: "1:371801365030:android:7d9566989343c5be3c64e7",
    messagingSenderId: "371801365030",
};

const app = initializeApp(firebaseConfig)
const auth = getAuth()
const firebaseDatabase = getDatabase()
export {
    auth,
    firebaseDatabase,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    firebaseSet,
    firebaseDatabaseRef,
    sendEmailVerification,
    child,
    get,
    onValue, //reload when online DB changed
    signInWithEmailAndPassword,
}