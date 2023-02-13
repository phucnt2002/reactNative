import React, {useState, useEffect} from 'react';
import {
    Text, 
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Keyboard
} from 'react-native'
import {    
    onAuthStateChanged,
    firebaseDatabaseRef,
    firebaseSet,
    firebaseDatabase,
    auth,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
} from '../firebase/firebase'

import {images, colors, icons, fontSizes} from '../constants'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {isValidEmail, isValidPassword} from '../utilies/Validations'
function Login(props) {
    const [keyboardIsShown, setKeyboardIsShown] = useState(false)
    //states for validating
    const [errorEmail, setErrorEmail] = useState('')
    const [errorPassword, setErrorPassword] = useState('')
    //states to store email/password
    const [email, setEmail] = useState('nguyenphuc2002ok@gmail.com')
    const [password, setPassword] = useState('123456Abc')
    const isValidationOK = () => email.length > 0 && password.length > 0
                            && isValidEmail(email) == true
                            && isValidPassword(password) == true

    useEffect(()=>{
        //componentDidMount
        Keyboard.addListener('keyboardDidShow', () => {            
            setKeyboardIsShown(true)
        })
        Keyboard.addListener('keyboardDidHide', () => {            
            setKeyboardIsShown(false)
        })
    })

    const {navigation, route} = props
    //functions of navigate to/back
    const {navigate, goBack} = navigation

    // useEffect(()=>{
    //     onAuthStateChanged(auth, (user)=>{
    //         if(user){
    //             const userId = user.uid
    //             //sava data base
    //             firebaseSet(firebaseDatabaseRef(
    //                 firebaseDatabase,
    //                 `users/${userId}`
    //             ), {
    //                 email: user.email,
    //                 tokenKey: user.emailVerified,
    //                 accessToken: user.accessToken,
    //                 emailVerified: user.emailVerified
    //             })
    //             navigate('UITab')
    //         }
    //     })
    // })

    //navigation
    // const {navigation, route} = props
    //functions of navigate to/back
    // const {navigate, goBack} = navigation

    return <KeyboardAvoidingView 
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{
        flex: 100,
        backgroundColor: 'white'
    }}>
        <View style={{
            flex: 30,
            flexDirection: 'row',            
            justifyContent: 'space-around',
            alignItems: 'center'
        }}>
            <Text style={{
                color: 'black',
                fontSize: fontSizes.h2,
                fontWeight: 'bold',
                width: '50%'
            }}>Already have an Account?</Text>
            <Image
                // tintColor = {colors.primary}
                source={
                    images.logo
                } style={{
                    width: 130,
                    height: 120,
                    alignSelf: 'center'
                }} />
        </View>
        <View style={{
            flex: 20,
            backgroundColor: '#E17A8D',
            padding: 10,
            marginLeft: 10,
            marginRight: 10,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,

        }}>
            <View style={{
                marginHorizontal: 15
            }}>
                <Text style={{
                    fontSize: 18,
                    color: '#001949',
                    marginTop: 15
                }}>Email:</Text>
                <TextInput
                    onChangeText={(text)=>{
                        /*
                       if(isValidEmail(text) == false) {
                           setErrorEmail('Email not in correct format')
                       } else {
                           setErrorEmail('')
                       }
                       */
                       setErrorEmail(isValidEmail(text) == true ? 
                                    '' : 'Email not in correct format')
                       setEmail(text)    
                    }}
                    style={{
                        color: 'black',
                        marginTop: 5

                    }}
                    keyboardType='email'
                    placeholder='example@gmail.com'
                    value={email}
                    placeholderTextColor={colors.placeholder}
                />
                <View style={{height: 1, 
                    backgroundColor: '#001949', 
                    width: '100%',                    
                    marginHorizontal: 15,
                    marginBottom: 5,
                    alignSelf: 'center'
                }} />
                <Text style={{
                    color: 'red', 
                    fontSize: fontSizes.h6,
                    marginBottom: 15,
                    }}>{errorEmail}</Text>
            </View>
            <View style={{
                marginHorizontal: 15
            }}>
                <Text style={{
                    fontSize: 18,
                    color: '#001949'
                }}>Password:</Text>
                <TextInput
                    onChangeText={(text)=>{
                        setErrorPassword(isValidPassword(text) == true ? 
                                    '' : 'Password must be at least 3 characters')
                        setPassword(text)    
                    }}                    
                    style={{
                        color: 'black',
                        marginTop: 5

                    }}
                    secureTextEntry={true}
                    placeholder='Enter your password'
                    value={password}
                    placeholderTextColor={colors.placeholder}
                />
                <View style={{height: 1, 
                    backgroundColor: '#001949', 
                    width: '100%',
                    marginBottom: 15,
                    marginHorizontal: 15,
                    alignSelf: 'center'
                }} />
                <Text style={{
                    color: 'red', 
                    fontSize: fontSizes.h6,
                    marginBottom: 15,                    
                    }}>{errorPassword}</Text>
            </View>
        </View>
        {keyboardIsShown == false ? <View style={{
            flex: 10,
            backgroundColor: '#E17A8D',
            padding: 10,
            marginLeft: 10,
            marginRight: 10,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,

        }}>
            <TouchableOpacity
                disabled = {isValidationOK() == false}
                onPress={() => {
                    // alert(`Email = ${email}, password = ${password}`)
                    signInWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {                        
                        const user = userCredential.user  
                        navigate('UITab')    
                    }).catch((error) => {
                        alert(`Cannot signin, error: ${error.message}`)
                    })                    
                }}
                style={{
                    backgroundColor: isValidationOK() == true 
                                        ? '#001949': colors.inactive,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '50%',
                    alignSelf: 'center',
                    borderRadius: 18
                }}>
                <Text style={{
                    padding: 8,
                    fontSize: fontSizes.h5,
                    color: 'white'
                }}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    navigate('Register')
                }}
                style={{ padding: 5 }}>
                <Text style={{
                    padding: 8,
                    fontSize: fontSizes.h6,
                    color: '#001949',
                    alignSelf: 'center',
                }}>New user? Register now</Text>
            </TouchableOpacity>

        </View> : <View style={{
            flex: 15
        }}></View>}
        {keyboardIsShown == false ? <View style={{
            flex: 25,            
        }}>
            <View style={{
                height: 40,
                flexDirection: 'row',   
                alignItems: 'center',
                marginHorizontal: 20
            }}>
                <View style={{height: 1, backgroundColor: 'black', flex: 1, 
                    marginTop:15}} />
                <Text style={{
                    padding: 8,
                    fontSize: fontSizes.h6,
                    color: '#E17A8D',
                    alignSelf: 'center',
                    marginHorizontal: 5,
                    marginTop:15
                }}>Use other methods ?</Text>
                <View style={{height: 1, backgroundColor: 'black', flex: 1, 
                    marginTop:15}} />
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop:15
            }}>
                <Icon name='facebook' size={35} color={colors.facebook} />
                <View style={{width: 15}}/>
                <Icon name='google' size={35} color={colors.google} />
            </View>
        </View> : <View style={{
            flex: 25,            
        }}></View>}
    </KeyboardAvoidingView>
}
export default Login