import React, {useState, useEffect}from 'react'
import { ImageBackground } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { View, Text, StyleSheet } from 'react-native'
import { Input, Button } from 'react-native-elements'
import { auth } from '../firebase'

const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    

    const signIn = () => {
        auth.signInWithEmailAndPassword(email, password)
        .catch((error) => {
        var errorMessage = error.message;
        alert(errorMessage)
        });
        }

        useEffect(() => {
            const unsubscribe = auth.onAuthStateChanged(function (user) {
            if (user) {
            navigation.replace('Groups');
            } else {
            // No user is signed in.
            navigation.canGoBack() && navigation.popToTop();
            }
            });
            return unsubscribe;
            }, [])
     const img = {uri: 'https://cdn-0.idownloadblog.com/wp-content/uploads/2021/04/abstract-iPhone-wallpaper-rshbfn-idownloadblog-Warp-1.png'}
    
return (

<View style={styles.container}>
<ImageBackground source={img} style={styles.image}>
<View style={styles.view}>
<Input
color='black'
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
color='black'
inputContainerStyle={styles.input}
placeholder='Enter your password'
placeholderTextColor='#d3d3d3'
label='Password'
labelStyle={{color:'#d3d3d3'}}
leftIcon={{ type: 'material', name: 'lock', color: 'white',}}
onChangeText={text => setPassword(text)}
secureTextEntry
/>
</View>

<TouchableOpacity style={styles.button} 
onPress={signIn}
>
    <Text style={styles.buttonText}>Login</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.button} 
onPress={()=>navigation.navigate('Register')}>
    <Text style={styles.buttonText}>Register</Text>
</TouchableOpacity>

</ImageBackground>
</View>
) 
}

const styles = StyleSheet.create({
    input:{ 
        borderRadius: 30, 
        borderColor: 'white',
        borderWidth: 2,
        margin: 3,
        backgroundColor: 'white'
    },
    view:{
       width: '95%',
       alignSelf:'center'
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        width: '100%',
        height:'100%',
    },
    container: {
    flex: 1,
    alignItems: 'center',
    },
    button: {
        width: 200,
        height:50,
        marginTop:10,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 50,
        borderColor: 'white',
        backgroundColor: '#ff0080',
        opacity: 0.8
    },
    buttonText:{
        color:'pink',
        marginTop:15,
        fontSize: 20
    }
    })
export default LoginScreen