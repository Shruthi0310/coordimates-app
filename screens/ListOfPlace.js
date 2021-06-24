import React, { useEffect, useState } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native';
import {Text, View,FlatList, Image, Linking,} from 'react-native'
import {Icon} from 'react-native-elements'
import { db, auth, ad} from '../firebase';


function ListOfPlaces({navigation}) {
    const [places, setPlaces] = useState([])
    const currUser = auth?.currentUser?.email;
    var grp;
    useEffect(() => {
        var place =[];
        const ref = db.collection('users').doc(currUser).get()
        .then(doc => {
            grp = doc.data().group
            db.collection('Groups').doc(doc.data().group).get().then(
                query => {
                    //console.log(query.data().ids)
                   db.collection('Places').where("id", "in", query.data().ids).get()
                   .then(next => {
                      next.forEach( x => {
                        place.push(x.data())
                        //console.log(x.data())
                      }) 
                      setPlaces(place)
                      
                    })
                   //can save the place inside group firebase
                   //console.log(place);
                }   
            )
            
        })

    }, [])




var bool = true;
var interval = setInterval(
async () => {
    bool = true;
    const ref = db.collection('Groups').doc(grp)
    const doc = await ref.get()
      
    if (!doc.exists) {
        bool = false;
 } else {
     if(doc.data().wheelPlace == null) {
           bool = false;
     } else {
        
        console.log(doc.data().wheelPlace)
    }
 }
  
    if(bool){
        navigation.replace('Selected Wheel')
        clearInterval(interval);
        
    }

}, 5000);

    function spinWheel(){
        navigation.replace('Spin The Wheel')
    }

    function exit(){
        //clear data
        // db.collection('Groups').doc(grp).update({
        //     ids: ad.FieldValue.delete(),
        //     wheelPlace: ad.FieldValue.delete(),
        //  })
         
        //  db.collection('users').doc(currUser).update({
        //     data: ad.FieldValue.delete(),
        //     group: ad.FieldValue.delete(),
        //     who: ad.FieldValue.delete()
        //   });

        navigation.navigate('Groups')
    }

    return (
       <View>
           <View style ={{flexDirection: 'row', top: '7%'}}>
           <TouchableOpacity style={styles.wheel}
           onPress={spinWheel}
           >
               <Text style={styles.wheelText}>Spin The Wheel</Text>
           </TouchableOpacity>
           <TouchableOpacity style={{
            marginLeft: '15%'
            }}
            onPress={exit}
            >
              <Icon
                name="close-circle-outline"
                type="ionicon"
                color='blue'
                iconStyle={{fontSize: 30}}
              ></Icon>
            </TouchableOpacity>
           </View>
           <FlatList
            style = {{height:'100%', top: '8%'}}
            data={places}
            keyExtractor= {item => item.id}
            renderItem={({ item }) => (
                <View>

                <TouchableOpacity style={styles.listItem}>
                   <Image
                      style={{width: 300,height:200}}
                      source={{uri: item.image}}
                      resizeMode="contain"
                   />
                   
                    <Text style={styles.listItemText}>{`${item.id}`}</Text>
                    <Text>Place description</Text>
                    <Text>Place rating</Text>
                    <Text style={{color: 'blue'}}
                           onPress={() => Linking.openURL('http://google.com')}>
                        Link to page website</Text>
                </TouchableOpacity>
                
                </View>
            )}
           >
           </FlatList>
       </View>
    );

}

const styles = StyleSheet.create({
    
    view:{
        flex: 1, 
        alignItems: "center", 
        justifyContent: "center"
    },listItem: {
        paddingBottom: '5%',
        paddingTop: 20,
        alignItems: 'center',
        backgroundColor: '#fff',
        width: '100%',
        borderRadius: 20,
        flexDirection: "column",
        alignItems: 'center',
      },
      listItemText: {
        fontSize: 20,
        fontWeight: "500",
        fontFamily: "Arial",
      },
      image:{
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
        alignSelf:'center',
      },
      wheel:{
        width: 200,
        height:50,
        borderRadius: 50,
        borderColor: 'white',
        backgroundColor: '#e06666',
        flexDirection:'column', 
        // top: '7%',
        marginLeft: '25%'
      },
      wheelText: {
          alignSelf: 'center',
          marginTop: 12,
          fontSize: 20,
          color: '#efefef'
      }
})

export default ListOfPlaces;