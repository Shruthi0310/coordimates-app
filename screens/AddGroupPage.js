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
  const [chosen, setChosen] = useState([])
  const [groupName, setGroupName] = useState('')
  function checkIsEnabled(val) {
     setIsEnable({ val });
  }



function addMembers(){
  console.log(chosen)  
}


// useLayoutEffect(()=> {
//     navigation.setOptions({
//         headerRight: () => (
//             <TouchableOpacity style={{ marginRight: 10}}
//             onPress={addMembers}
//             > 
//               <Text style={{color:"blue", fontSize:18 }}>Done</Text>
//             </TouchableOpacity>
//         )
//     })
// })

    return (
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.root}
        keyboardShouldPersistTaps="handled">
        {/* <View>
            <Text style= {{fontSize:12, color:"#767676"}}>Group Name:</Text>
            <TextInput
            style={{fontSize:16, borderBottomColor: '#d3d3d3',
            borderBottomWidth: 1, padding: 6 }}
            placeholder="Please enter group name"
            onChangeText = {name => setGroupName(name)}
            ></TextInput>
        </View> */}
        <View>
          <EmailField
            // ref={c => this._emailField = c}
            itemId="email"
            items={data}
            // showItems='onTyping'
            // onChangeSelectedItems = {(selectedItems)=> console.log(selectedItems)}
            // onSubmitEditing={val => checkIsEnabled(val)}
            
            onChipClose={val => checkIsEnabled(val)}
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