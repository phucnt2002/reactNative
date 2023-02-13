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

import {images, colors, icons, fontSizes} from '../constants'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {isValidEmail, isValidPassword} from '../utilies/Validations'
import {    
    onAuthStateChanged,
    firebaseDatabaseRef,
    firebaseSet,
    firebaseDatabase,
    auth,
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from '../firebase/firebase'
function Register(props) {
    const [keyboardIsShown, setKeyboardIsShown] = useState(false)
    //states for validating
    const [errorEmail, setErrorEmail] = useState('')
    const [errorPassword, setErrorPassword] = useState('')
    //states to store email/password
    const [email, setEmail] = useState('nguyenphuc2002ok@gmail.com')
    const [password, setPassword] = useState('123456Abc')
    const [retypePassword, setRetypePassword] = useState('123456Abc')
    const isValidationOK = () => email.length > 0 && password.length > 0
                            && isValidEmail(email) == true
                            && isValidPassword(password) == true
                            && password == retypePassword

    useEffect(()=>{
        const xx = auth
        //componentDidMount        
        Keyboard.addListener('keyboardDidShow', () => {            
            setKeyboardIsShown(true)
        })
        Keyboard.addListener('keyboardDidHide', () => {            
            setKeyboardIsShown(false)
        })               
    })
    //navigation
    const {navigation, route} = props
    //functions of navigate to/back
    const {navigate, goBack} = navigation
    return <View     
    style={{
        flex: 100,
        backgroundColor: 'white',
        
    }}>
        <View style={{
            flex: 25,
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
                // tintColor = {'white'}
                source={
                    images.logo
                } style={{
                    width: 130,
                    height: 120,
                    alignSelf: 'center'
                }} />
        </View>
        <View style={{
            flex: 40,
            backgroundColor: '#001949',
            padding: 10,
            margin: 10,
            borderRadius: 20,
            shadowColor: '#000',
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity:  0.4,
          shadowRadius: 3,
          elevation: 5,
        }}>
            <View style={{
                marginHorizontal: 15
            }}>
                <Text style={{
                    fontSize: 18,
                    color: 'white',
                    marginTop: 25
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
                        color: 'white',
                        marginTop: 5
                    }}
                    placeholder='example@gmail.com'
                    value={email}
                    placeholderTextColor={colors.placeholder}
                />
                <View style={{height: 1, 
                    backgroundColor: '#E17A8D', 
                    width: '100%',                    
                    marginHorizontal: 15,
                    marginBottom: 5,
                    alignSelf: 'center'
                }} />
                <Text style={{
                    color: 'red', 
                    fontSize: fontSizes.h6,
                    marginBottom: 10,
                    }}>{errorEmail}</Text>
            </View>
            <View style={{
                marginHorizontal: 15
            }}>
                <Text style={{
                    fontSize: 18,
                    color: 'white'
                }}>Password:</Text>
                <TextInput
                    onChangeText={(text)=>{
                        setErrorPassword(isValidPassword(text) == true ? 
                                    '' : 'Password must be at least 3 characters')
                        setPassword(text)    
                    }}
                    style={{
                        color: 'white'
                    }}
                    secureTextEntry={true}
                    value={password}
                    placeholder='Enter your password'
                    placeholderTextColor={colors.placeholder}
                />
                <View style={{height: 1, 
                    backgroundColor: '#E17A8D', 
                    width: '100%',
                    marginBottom: 10,
                    marginHorizontal: 15,
                    alignSelf: 'center'
                }} />
                <Text style={{
                    color: 'red', 
                    fontSize: fontSizes.h6,
                    marginBottom: 15,                    
                    }}>{errorPassword}</Text>
            </View>
            <View style={{
                marginHorizontal: 15,
            }}>
                <Text style={{
                    fontSize: 18,
                    color: 'white'
                }}>Retype password:</Text>
                <TextInput
                    onChangeText={(text)=>{
                        setErrorPassword(isValidPassword(text) == true ? 
                                    '' : 'Password must be at least 3 characters')
                        setRetypePassword(text)                                    
                    }}
                    style={{
                        color: 'white'
                    }}
                    value={retypePassword}
                    secureTextEntry={true}
                    placeholder='Re-Enter your password'
                    placeholderTextColor={colors.placeholder}
                />
                <View style={{height: 1, 
                    backgroundColor: '#E17A8D', 
                    width: '100%',
                    marginBottom: 10,
                    marginHorizontal: 15,
                    alignSelf: 'center'
                }} />
                <Text style={{
                    color: 'red', 
                    fontSize: fontSizes.h6,
                    marginBottom: 5,                    
                    }}>{errorPassword}</Text>
            </View>
            <TouchableOpacity
                disabled = {isValidationOK() == false}
                onPress={() => {
                    //alert(`Email = ${email}, password = ${password}`)
                    createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {                        
                        const user = userCredential.user
                        sendEmailVerification(user).then(()=>{
                            console.log('Email verification sent')
                        })                        
                        firebaseSet(firebaseDatabaseRef(
                            firebaseDatabase,
                            `users/${user.uid}`
                        ), {
                            email: user.email,
                            tokenKey: user.emailVerified,
                            accessToken: user.accessToken,
                            emailVerified: user.emailVerified
                        })
                        navigate('UITab')    

                    }).catch((error) => {
                        alert(`Cannot signin, error: ${error.message}`)
                    })
                }}
                style={{
                    backgroundColor: isValidationOK() == true 
                                        ? '#E17A8D': colors.inactive,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '50%',
                    alignSelf: 'center',
                    borderRadius: 18,
                    marginTop: 20
                }}>
                <Text style={{
                    padding: 8,
                    fontSize: fontSizes.h5,
                    color: 'white'
                }}>Register</Text>
            </TouchableOpacity>  
            <TouchableOpacity
                onPress={() => {
                    navigate('Login')
                }}
                style={{ padding: 5 }}>
                <Text style={{
                    padding: 8,
                    fontSize: fontSizes.h6,
                    color: 'white',
                    alignSelf: 'center',
                }}>Login</Text>
            </TouchableOpacity>
        </View>
        
        {keyboardIsShown == false ? <View style={{
            flex: 20,            
        }}>
            <View style={{
                height: 40,
                flexDirection: 'row',   
                alignItems: 'center',
                marginHorizontal: 20
            }}>
                <View style={{height: 1, backgroundColor: 'white', flex: 1}} />
                <Text style={{
                    padding: 8,
                    fontSize: fontSizes.h6,
                    color: '#E17A8D',
                    alignSelf: 'center',
                    marginHorizontal: 5,
                }}>Use other methods ?</Text>
                <View style={{height: 1, backgroundColor: 'white', flex: 1}} />
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center'
            }}>
                <Icon name='facebook' size={35} color={colors.facebook} />
                <View style={{width: 15}}/>
                <Icon name='google' size={35} color={colors.google} />
            </View>

        </View> : <View style={{
            flex: 25,            
        }}></View>}
    </View>    

}
export default Register