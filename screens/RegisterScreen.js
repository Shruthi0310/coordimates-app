import React,{ useState, useEffect } from 'react'
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native'
import { Input, Button } from 'react-native-elements'
import {auth, db} from '../firebase'

const RegisterScreen = ({navigation}) => {
 
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const register = ({navigation}) => {
          
         const data= {
             Name: name,
             _id: email
         }

         db.collection('Users').doc(email).set(data)

        auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
        var user = userCredential.user;
        user.updateProfile({
        displayName: name,
        photoURL: imageUrl ? imageUrl : "https://www.trackergps.com/canvas/images/icons/avatar.jpg"
        }).catch(function (error) {
       // alert(error.message)
        });
        navigation.popToTop();
        })
        .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        //alert(errorMessage)
        });

        
    }

        useEffect(() => {
            const unsubscribe = auth.onAuthStateChanged(function (user) {
            if (user) {
            navigation.replace('Groups');
            } else {
            // No user is signed in.
            }
            });
            return unsubscribe;
            }, [])
    const img = {uri: 'https://cdn-0.idownloadblog.com/wp-content/uploads/2021/04/abstract-iPhone-wallpaper-rshbfn-idownloadblog-Warp-1.png'}
 //const img = {uri: 'https://image.freepik.com/free-vector/abstract-background-mobile-fluid-shapes-with-gradient-effect_79603-560.jpg'}
    return (
        <View style={styles.container}>
        <ImageBackground source={img} style={styles.image}>
        <View style={styles.view}>
        <Input
        inputContainerStyle={styles.input}
        placeholder='Enter your name'
        placeholderTextColor='#d3d3d3'
        label='Name'
        labelStyle={{color:'#d3d3d3'}}
        leftIcon={{ type: 'material', name: 'badge', color:'white'}}
        value={name}
        onChangeText={text => setName(text)}
        />
        <Input
        inputContainerStyle={styles.input}
        placeholder='Enter your email'
        placeholderTextColor='#d3d3d3'
        label='Email'
        labelStyle={{color:'#d3d3d3'}}
        leftIcon={{ type: 'material', name: 'email', color:'white' }}
        value={email}
        onChangeText={text => setEmail(text)}
        />
        <Input
       inputContainerStyle={styles.input}
       placeholder='Enter your password'
       placeholderTextColor='#d3d3d3'
       label='Password'
       labelStyle={{color:'#d3d3d3'}}
        leftIcon={{ type: 'material', name: 'lock', color:'white' }}
        value={password} onChangeText={text => setPassword(text)}
        secureTextEntry
        />
        <Input
        inputContainerStyle={styles.input}
        placeholder='Enter your image url'
        placeholderTextColor='#d3d3d3'
        label='Profile Picture'
        labelStyle={{color:'#d3d3d3'}}
        leftIcon={{ type: 'material', name: 'face', color:'white'}}
        onChangeText={text => setImageUrl(text)}
        />
        </View>

        <TouchableOpacity style={styles.button} 
        onPress={register}>
         <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        {/* <Button
        title="register" style={styles.button}
        onPress={register}
        /> */}
        </ImageBackground>
        </View>
    );
  
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    alignItems: 'center',
    },
    button: {
    width: 200,
    marginTop: 10
    },
    input:{ 
        borderRadius: 30, 
        borderColor: 'white',
        borderWidth: 2,
        margin: 3,
        backgroundColor: 'white'
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        width: '100%',
        height:'100%',
    },
    view:{
        width: '95%',
        alignSelf:'center'
     },
     button: {
        width: 200,
        height:50,
        marginTop:10,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 50,
        borderColor: 'white',
        backgroundColor: '#00b2ff',
        opacity: 0.8
    },
    buttonText:{
        color:'#e4e6eb',
        marginTop:15,
        fontSize: 20
    }
    });


export default RegisterScreen;