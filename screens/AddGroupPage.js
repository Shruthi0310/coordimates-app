import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useLayoutEffect} from 'react';
import { ScrollView, StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import EmailField from '../components/EmailField';
import {db} from "../firebase"


function AddGroupPage ({navigation}){

  
    useEffect(() => {
        var userarr = [];
        db.collection('Users').get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            userarr.push(doc.data()._id)
          }
          )
         
        }).then(()=> {
          setData(userarr)
        })
      }, [])


 
  const [data, setData] = useState([])
  const [isEnabled, setIsEnable] = useState(false);
  
  function checkIsEnabled(val) {
     setIsEnable({ val });
  }



    return (
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.root}
        keyboardShouldPersistTaps="handled">
        <View>
          <EmailField
            itemId="email"
            items={data}
            onChipClose={val => checkIsEnabled(val)}
            navigation={navigation}
          />

        </View>
      </ScrollView>
    );
  }

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 20,
    
  },
  root: {
    flex: 1,
    padding: 20
  },
});

export default AddGroupPage