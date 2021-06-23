import React, { useEffect, useState } from 'react'
import { FlatList, TouchableOpacity, Text, TextInput} from 'react-native'
import {View, StyleSheet} from 'react-native'
import {Avatar} from 'react-native-elements'
import {db} from "../firebase"
//import filter from 'lodash.filter'
import { Chip, Selectize as ChildEmailField } from 'react-native-material-selectize';



function AddGroup() {

useEffect(() => {
  var userarr = [];
  db.collection('Users').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
     // console.log(doc.data()._id)
      userarr.push(doc.data())
    }
    )
  }).then(()=> {
    setData(userarr)
    setFullData(userarr)
  })
}, [])

const handleSearch = text => {
  const formattedQuery = text.toLowerCase();
  const filteredData = filter(fullData, user => {
    return contains(user, formattedQuery);
  });
  setData(filteredData);
  setQuery(text);
};


const contains = ({_id}, query) => {

  if (_id.includes(query)) {
    return true;
  }

  return false;
};

// if (isLoading) {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <ActivityIndicator size="large" color="#5500dc" />
//     </View>
//   );
// }

    const[data, setData] = useState([])
    const [query, setQuery] = useState('');
    const [fullData, setFullData] = useState([]);
    const members = [];
    function renderHeader() {
      return (
        <View
          style={{
            backgroundColor: '#fff',
            padding: 10,
            marginVertical: 10,
            borderRadius: 20
          }}
        >
          <TextInput
            autoFocus={true}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="always"
            value={query}
            onChangeText={queryText => handleSearch(queryText)}
            placeholder="Search"
            style={{ backgroundColor: '#fff', paddingHorizontal: 20 }}
          />
        </View>
      );
    }
     
    // const [memlist, setMemList] = useState([])
    var memlist = [];
    function addPress(item){
       members.push(item)
       memlist = members;
       //setMemList(members);
      // const mem = item._id.toString();
      // memberlist.push("hi")
      console.log("start")
      console.log(memlist);
      // console.log("hello")
      // console.log(memlist);
    }
     
   return (
       <View>
           <FlatList
             style = {{height:'50%'}}
              ListHeaderComponent={renderHeader}
              data={data}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={()=>addPress(item)}>
                  <View
                    style={styles.listItem}>
                    {/* <Avatar
                      rounded
                      source={{
                      uri: item.photoURL,}}
                      style={{ marginRight: 16 }}
                    /> */}
                    <Text
                      category='s1'
                      style={styles.listItemText}>{`${item._id}`}</Text>
                  </View>
                </TouchableOpacity>
              )}
           />

           <View style={{top:20}}>
             <Text style={{fontSize:20}}>Members to add:</Text>
             <FlatList
             data={members}
             keyExtractor={item => item._id}
             renderItem={({ item }) => (
              <TouchableOpacity>
                  <View>
                    <Text
                      category='s1'
                      >{`${item._id}`}</Text>
                  </View>
                </TouchableOpacity>
             )}
             />
           </View>
       </View>
   )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    alignItems: 'center'
  },
  text: {
    fontSize: 20,
    color: '#101010',
    marginTop: 60,
    fontWeight: '700'
  },
  listItem: {
    marginTop: 10,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 10
  },
  listItemText: {
    fontSize: 18
  }
});

export default AddGroup