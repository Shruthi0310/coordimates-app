import React, { Component, useState } from 'react'
import { View, StyleSheet, Text, Button, ScrollView, } from 'react-native';
import SwitchSelector from 'react-native-switch-selector'
import {db, auth, data} from '../firebase'
import SelectMultiple from 'react-native-select-multiple'
import { LogBox } from 'react-native'

LogBox.ignoreLogs([
    'VirtualizedLists should never be nested',
    'componentWillReceiveProps has been renamed'
])

function Form({navigation}) {

const activityopt= [ 
        {label:'Eat', value:'eat'},
        {label:'Games and Sports', value:'Games and Sports'},
        {label:'Sightseeing', value:'sightseeing'},
        // {label:'Sports', value:'sports'},
        {label:'Shop', value:'shop'},
        {label:'Nature and Parks', value:'Nature and parks'},
        {label: 'Arts and Culture', value: 'Arts and Culture'}];

const timeopt = [ 
        {label:'Morning', value: 'morning'},
        {label:'Afternoon', value:'afternoon'},
        {label:'Night', value: 'night'},
        {label:'No preference', value:'all'}];    


const areaopt = [ 
        {label:'East', value: 'east'},
        {label:'West', value:'west'},
        {label: 'North', value: 'north'},
        {label:'South', value: 'south'},
        {label:'Central', value:'Central'}];

const priceopt = [
    {label: "$", value: "$"},
    {label: "$$", value: "$$"},
    {label: "$$$", value: "$$$"}
];

const outorinopt = [
    {label: 'outdoors', value: 'out'},
    {label: 'indoors', value: 'in'},
    {label: 'No preference', value: 'all'}
]

const[area, setArea] = useState([])
const[time, setTime] = useState([])
const[price, setPrice] = useState('$')
const[outorin, setOutorin] = useState('out')
const[activity, setActivity] = useState([])



const ref = db.collection('Places')
const userRef = db.collection('users')


function writeUserData(userdata) {
    navigation.replace('Waiting')
   const userId = auth?.currentUser?.email;
  userRef.doc(userId).set({data: userdata}, {merge:true});
  
}

  function onSubmit(){
    var arr = [];
    const hello = ref.where("price", "==", price)
    .where("outorin", "==", outorin)
    .where("area", "in", area.map(e => e.value))
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            for(var i=0; i < time.length; i++){
                 for(var j=0;  j < activity.length; j++) {
                    if((doc.data().type == activity.map(e=>e.value)[j])
                    && (doc.data().time == time.map(e=>e.value)[i])){
                       arr.push(doc.data())
                      console.log(arr)
             }
             }
            }
        
        })
        writeUserData(arr);
        
    }
        
    )
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}

return (
<View style= {{flex:1}}>
<ScrollView style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}>
    <Text style={styles.priceSelect}>Select price range:</Text>
        <SwitchSelector style={styles.switcher} options={priceopt} initial={0} onPress={value=> setPrice(value)}/>
    <Text style={styles.areapref}>Select area preference (one or more):</Text>
        <SelectMultiple style= {{top: 40, height: 190}}
                        items={areaopt}
                        selectedItems={area}
                        onSelectionsChange={selectedItems => setArea(selectedItems)}/>
    <Text style={styles.timepref}> Select time preference (one or more):</Text>
        <SelectMultiple style= {{top: 60, height: 190}}
                        items={timeopt}
                        selectedItems={time}
                        onSelectionsChange={selectedItems => setTime(selectedItems)}/>
    <Text style={styles.outorin}> Select indoors or outdoors:</Text>
        <SwitchSelector style={{top:85}} options={outorinopt} initial={0} onPress={value=> setOutorin(value)}/>
    <Text style={styles.activity}>Select type of activities: </Text>
        <SelectMultiple style= {{top: 115, height: 190}}
                        items={activityopt}
                        selectedItems={activity}
                        onSelectionsChange={selectedItems => setActivity(selectedItems)}/>
    <View style={styles.nextbutton}>
        <Button color='#fff' title="Let's Go!"
            // onPress={()=> navigation.navigate('FormPageTwo')}
         onPress={onSubmit}
            />
    </View>
    {/* <View style={styles.backbutton}>
        <Button color="#fff" title="Back"/>
    </View> */}
    
</ScrollView>
</View>
);
}
const styles = StyleSheet.create({
    scrollView: {
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        flex:1
      },
      contentContainer: {
        paddingBottom: 160
      },
    priceSelect:{
        top: 15,
        fontSize: 17,
        fontWeight:'bold',
    },
    switcher: {
        top: 20
    },

    areapref: {
        top:25,
        fontSize: 17,
        fontWeight:'bold',
    },
    timepref: {
        top:55,
        fontSize: 17,
        fontWeight:'bold',
    }, 
    outorin:{
        top: 77,
        fontSize: 17,
        fontWeight:'bold',
    },
    activity: {
        top: 105,
        fontSize: 17,
        fontWeight:'bold',
    },
    nextbutton: {
        backgroundColor: '#4ecdc4',
        width:120,
        alignSelf: 'center',
        top:140
    }, 
    // backbutton: {
    //     backgroundColor: '#4ecdc4',
    //     color:'#fff',
    //     alignSelf: 'flex-start',
    //     width:120,
    //     top:103
    // }
  
  })
export default Form;
