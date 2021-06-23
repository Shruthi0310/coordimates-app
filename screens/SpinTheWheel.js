import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, StatusBar, Button, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements'
import { set } from 'react-native-reanimated';
import { db, auth} from '../firebase';
import WheelOfFortune from 'react-native-wheel-of-fortune';


function Wheel({navigation}){
    const[places,setPlaces] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    var wheelOptions = {

    }
    useEffect(() => {
        var place = [];
        const currUser = auth?.currentUser?.email;
        const ref = db.collection('users').doc(currUser)
        const hel = ref.get()
        .then(doc => {
            db.collection('Groups').doc(doc.data().group).get().then(
                query => {
                 setPlaces(query.data().ids)
                 setIsLoading(false)
                }   
            )
            
        })

    }, [])

  const [winnerValue, setWinnerVal] = useState(null)
  const [winnerIndex, setIndexVal] = useState(null)
  const [started , setStarted] = useState(false);
  
   
  function buttonPress(){
   setStarted(true);
   WheelOfFortune.child._onPress();
  };

    var wheelOptions = {
      rewards: places,
      knobSize: 30,
      borderWidth: 5,
      borderColor: '#fff',
      innerRadius: 30,
      duration: 4000,
      backgroundColor: 'transparent',
      textAngle: 'horizontal',
      knobSource: require("../node_modules/react-native-wheel-of-fortune/assets/images/knob.png"),
      onRef: ref => (WheelOfFortune.child = ref),
    };

    function done(){
      db.collection('Places').where("id", "==", places[winnerIndex]).get().then(
        query => {
          query.forEach(doc => {
            const currUser = auth?.currentUser?.email;
            const ref = db.collection('users').doc(currUser).get()
            .then(next => {
                db.collection('Groups').doc(next.data().group).
                set({wheelPlace: doc.data()}, {merge: true})
              })
            //console.log(doc.data())
          })
        }
      )
      //navigation.navigate('Groups')
  }
    return (
    <View style={{top: '50%',}}>
      <View style={{alignSelf: 'flex-start', bottom: 320, left: 360}}>
      <TouchableOpacity 
            onPress={done}
            >
              <Icon
                name="arrow-forward-outline"
                type="ionicon"
                color='blue'
                iconStyle={{fontSize: 30}}
              ></Icon>
            </TouchableOpacity>
      {/* <Text>Hello</Text> */}
      </View>
     {!isLoading && (<View style={styles.container}>
        <StatusBar barStyle={'light-content'} />
        <WheelOfFortune
          options={wheelOptions}
          getWinner={(value, index) => {
              setWinnerVal(value);
              setIndexVal(index)
          }}
        />
        {!started && (
          <View style={styles.startButtonView}>
            <TouchableOpacity
              onPress={buttonPress}
              style={styles.startButton}>
              <Text style={styles.startButtonText}>Choose!</Text>
            </TouchableOpacity>
          </View>
         )} 
         {winnerIndex != null && ( 
          <View style={styles.winnerView}>
            <TouchableOpacity 
              onPress={() => {
                setIndexVal(null);
                WheelOfFortune.child._tryAgain();
              }}
              style={styles.tryAgainButton}>
              <Text style={styles.tryAgainText}>Choose Again</Text>
            </TouchableOpacity>
          </View>
         )}

         {winnerIndex !=null && ( 
          <View style={styles.winner}>
            <Text style={styles.winnerText}>
              {places[winnerIndex]}!
            </Text>
          </View>
         )
         } 
      </View>)}
      </View>
    );

}
export default Wheel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a2c4c9',
    flexDirection: 'row'
  },
  startButtonView: {
    position: 'absolute',
  },
  startButton: {
    backgroundColor: 'rgba(0,0,0,.5)',
    marginTop: 50,
    padding: 5,
  },
  startButtonText: {
    fontSize: 50,
    color: '#fff',
    fontWeight: 'bold',
  },
  winnerView: {
    position: 'absolute',
    justifyContent: 'center',
    alignContent: 'flex-end',
  },
  winner:{
    position: 'absolute',
    flexDirection: 'column',
    alignSelf:'flex-end',
    
  },
  winnerText: {
    fontSize:30,
    marginBottom:250,
    fontWeight: "bold"
  },
  tryAgainButton: {
    padding: 5,
    marginTop: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  tryAgainText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
});