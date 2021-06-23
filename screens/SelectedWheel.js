import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { db, auth } from '../firebase';

function SelectedWheel({navigation}){
    const [loading, setLoading] = useState(true);
    var place;
    
    useEffect(() => {
       const currUser = auth?.currentUser?.email;
       const ref = db.collection('users').doc(currUser).get()
       .then(doc => { 
         db.collection('Groups').doc(doc.data().group).get()
         .then(query => {
             place = query.data().wheelPlace;
             //console.log(query.data().wheelPlace.image)
             setLoading(false);
         })
       })
 
    },[])

    return(
       <View style={{alignItems: 'center', justifyContent: 'center'}}>
          {!loading && (
              <View style={styles.listItem}>
              <Image
                 style={{width: 300,height:200}}
                 source={{uri: place.image}}
                 resizeMode="contain"
              />
              
               <Text style={styles.listItemText}>{`${place.id}`}</Text>
               <Text>Place description</Text>
               <Text>Place rating</Text>
               <Text style={{color: 'blue'}}
                      onPress={() => Linking.openURL('http://google.com')}>
                   Link to page website</Text>
           </View>
          )}
       </View>
    );
}

const styles = StyleSheet.create({

    listItem: {
      padding: 18,
      alignItems: 'center',
      backgroundColor: '#fff',
      width: '100%',
      borderRadius: 10,
      flexDirection: "row",
    },
    listItemText: {
      fontSize: 20,
      top: -10,
      fontWeight: "500",
      fontFamily: "Arial"
    }
  });

export default SelectedWheel;