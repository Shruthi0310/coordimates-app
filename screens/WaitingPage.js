import React, { useState,useEffect} from 'react'
import { TouchableOpacity } from 'react-native'
import {Text, View,Image, StyleSheet, ActivityIndicator,ImageBackground} from 'react-native'
import {auth, db} from '../firebase'

function WaitingPage({navigation}) {
const[done, setDone] = useState(false)

var users = [];
useEffect(() => {
    const currUser = auth?.currentUser?.email;
    db.collection('users').doc(currUser).get().then(query =>{
    users = query.data().who;
    })
})


var bool = true;
var interval = setInterval(
async () => {
    bool = true;
    for(var i =0; i< users.length; i++){
    const ref = db.collection('users').doc(users[i])
    const doc = await ref.get()
      if (!doc.exists) {
             bool = false;
      } else {
          if(doc.data().data == null) {
                bool = false;
          } else {

          }
      }
    }
  
    if(bool){
        //console.log('done')
        var arrs = [];
        setDone(true)
        for(var i =0; i < users.length; i++) {
            const ref = db.collection('users').doc(users[i])
            const doc = await ref.get()
        
            arrs.push(doc.data().data.map(x => x.id))
            if(i == users.length-1){
                var result = arrs.reduce((a, b) => a.filter(c => b.includes(c)));
                db.collection('Groups').doc(doc.data().group).set({ids: result}, {merge: true})
                navigation.replace('List Of Places');
            }
        }
        clearInterval(interval);
    }

}, 10000);
   


  if(!done) {
      console.log('not done')
  }
  
  

          
         const image ={uri:'https://cdn.dribbble.com/users/2479507/screenshots/8678351/media/d336cea07ca3557d6bf17376eb7b68af.gif'}
 return (
    <View style={styles.wait}>
        <Text style={styles.text}>Waiting for your friends...</Text>
        <Text style={styles.text}>Please don't leave this page</Text>
        <View style={styles.load}>
        <ActivityIndicator size="large" color="#0000ff"/>
        </View>
        <Image source={image}style={styles.gif} />

    </View>
 );

}

const styles = StyleSheet.create({
   
    wait:{
        flex: 1,
        justifyContent: "center",
        flexDirection: 'column',
        backgroundColor: 'white'
        
    },
    text:{
        alignSelf: 'center',
        padding:20,
        fontSize: 18,
        color:'#767676'
    },
    load:{
        alignSelf: 'center'
    },
    gif: {
        resizeMode: 'stretch',
        width: '80%',
        height: '40%',
        alignSelf:'center'
      }

})

export default WaitingPage
