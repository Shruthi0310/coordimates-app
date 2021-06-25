import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native'
import { Icon } from 'react-native-elements'
import { db, auth, ad } from '../firebase';

function SelectedWheel({ navigation }) {
   const [loading, setLoading] = useState(true);
   const [place, setPlace] = useState('')
   const currUser = auth?.currentUser?.email;
   var grp;
   useEffect(() => {
      const ref = db.collection('users').doc(currUser).get()
         .then(doc => {
            grp = doc.data().group
            db.collection('Groups').doc(doc.data().group).get()
               .then(query => {
                  setPlace(query.data().wheelPlace);
                  //console.log(query.data().wheelPlace.image)
                  setLoading(false);
               }
               )

         })

   }, [])

   function exit() {
      //clear data
     
      const ref = db.collection('users').doc(currUser).get()
         .then(doc => {
            const grp = doc.data().group
            db.collection('Groups').doc(grp).update({
               ids: ad.FieldValue.delete(),
               wheelPlace: ad.FieldValue.delete(),
            })

         })

      db.collection('users').doc(currUser).update({
         data: ad.FieldValue.delete(),
         group: ad.FieldValue.delete(),
         who: ad.FieldValue.delete()
      });
      navigation.navigate('Groups')
   }

   function back() {
      navigation.navigate('List Of Places')
   }

   return (
      <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
         <View>
            <TouchableOpacity
               onPress={back}
               style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center', top: 40 }}
            >
               <Icon
                  name="chevron-back-outline"
                  type="ionicon"
                  color='blue'
                  iconStyle={{ fontSize: 30 }}
               ></Icon>
               <Text style={{ color: 'blue', fontSize: 20 }}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
               marginLeft: '75%', top: 10
            }}
               onPress={exit}
            >
               <Icon
                  name="close-circle-outline"
                  type="ionicon"
                  color='blue'
                  iconStyle={{ fontSize: 30 }}
               ></Icon>
            </TouchableOpacity>
            {!loading && (
               <View style={styles.listItem}>
                  <Text style={{ fontSize: 20, paddingBottom: 10 }}>The place selected for you is: </Text>
                  <Image
                     style={{ width: 400, height: 250 }}
                     source={{ uri: place.image }}
                     resizeMode="contain"
                  />

                  <Text style={styles.listItemText}>{`${place.id}`}</Text>
                  <Text>Place description</Text>
                  <Text>Place rating</Text>
                  <Text style={{ color: 'blue' }}
                     onPress={() => Linking.openURL('http://google.com')}>
                     Link to page website</Text>
               </View>
            )}
         </View>
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
      flexDirection: "column",
      alignSelf: 'center',
      top: '25%'
   },
   listItemText: {
      fontSize: 20,
      fontWeight: "500",
      fontFamily: "Arial"
   }
});

export default SelectedWheel;