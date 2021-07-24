import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Avatar, Icon } from 'react-native-elements'
import { db, auth } from "../firebase"


export default function GroupPage({ navigation }) {
  const [groups, setGroups] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);


  const signOut = () => {
    auth.signOut().then(() => {
      navigation.replace("Login");
    }).catch((error) => {
      console.log(error.message)
    });
  }

  const create = () => {
    navigation.navigate('Create Group')

  }

  function settings(){
    navigation.navigate('Profile')
  }

  function feed(){
    navigation.navigate('Feed')
  }



  


  useLayoutEffect(() => {

    navigation.setOptions({
      headerLeft: () => (
        <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={{ marginLeft: 20 }}
          onPress={create}
        >
          <Icon
            name="add-outline"
            type="ionicon"
            color='blue'
            iconStyle={{ fontSize: 30 }}
          ></Icon>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 10 }}
          onPress={feed}
        >
          <Icon
            name="newspaper-outline"
            type="ionicon"
            color='blue'
            iconStyle={{ fontSize: 30 }}
          ></Icon>
        </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
          onPress={settings}
          style={{marginRight: 10}}
        >
          <Icon
            name="settings-outline"
            type="ionicon"
            color='blue'
            iconStyle={{ fontSize: 30 }}
          ></Icon>
        </TouchableOpacity>

        <TouchableOpacity style={{
          marginRight: 10
        }}
          onPress={signOut}
        >
           
          <Icon
            name="log-out-outline"
            type="ionicon"
            color='blue'
            iconStyle={{ fontSize: 30 }}
          ></Icon>
        </TouchableOpacity>
        </View>
      )
    })
  })


  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  
  function getData(){
      var groupArr = [];
      //var membersArry = [];
      const currUser = auth?.currentUser?.email;
      const mem = db.collection('Users').doc(currUser).collection('groups').get()

      mem.then((query) => {
        var num = 0;
        query.forEach(doc => {
          const arr = [doc.id, doc.data()]
          groupArr.push(arr)
        });
        setGroups(groupArr);
        //setMembers(membersArry);
        //setRefreshing(false)
        wait(1000).then(()=>setRefreshing(false))
        setLoading(false)
      }).catch((error) => {
        console.log("Error getting documents: ", error);
      }
      );
  }

  function onRefresh(){
    setRefreshing(true)
    setGroups([])
    getData()
  }

  useEffect(() => {
    let isCancelled = false;
    const unsubscribe = navigation.addListener('focus', 
   
    () => {
      var groupArr = [];
      //var membersArry = [];
      const currUser = auth?.currentUser?.email;
      const mem = db.collection('Users').doc(currUser).collection('groups').get()

      mem.then((query) => {
        var num = 0;
        query.forEach(doc => {
          const arr = [doc.id, doc.data()]
          groupArr.push(arr)
        });
        
        if (!isCancelled) {
          setGroups(groupArr);
        //setMembers(membersArry);
        setLoading(false)
        }
        
      }).catch((error) => {
        console.log("Error getting documents: ", error);
      }
      )
      ;}
    );
    return () => {
      isCancelled = true;
      unsubscribe;
    };

  }, [navigation])

  function renderSeparator() {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };


  return (
    <View>
      {!loading && (<View>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ItemSeparatorComponent={renderSeparator}
          style={{ height: '100%' }}
          data={groups}
          keyExtractor={item => item[0]}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity
                style={styles.listItem}>
                <View style={{ marginRight: 8 }}>
                  <Avatar
                    avatarStyle={{ borderColor: '#d3d3d3', borderWidth: 1, }}
                    size="medium"
                    rounded
                    source={{
                      uri: (item[1].imageUrl != '') ? item[1].imageUrl : 'http://criticdaily.com/uploads/user-group/default_group.png'
                    }} />
                </View>
                <View
                  style={{ flexShrink: 1, }}>
                  <Text
                    category='s1'
                    style={styles.listItemText}>{`${item[0]}`}</Text>
                  <Text style={{ fontSize: 14, flexShrink: 1 }}>Members: {`${item[1].users}`}</Text>
                </View>
                <TouchableOpacity
                  style={{ alignSelf: "flex-end", marginLeft: "auto" }}
                  onPress={() => {
                    const currUser = auth?.currentUser?.email;
                    db.collection('users').doc(currUser).set({ who: item[1].users, group: item[0] })
                    navigation.navigate('Choose Your Place')
                  }}
                >
                  <Icon name='chevron-forward-circle-outline'
                    type='ionicon'
                    color='blue'
                    iconStyle={{ fontSize: 30 }}
                  ></Icon>
                </TouchableOpacity>
              </TouchableOpacity>

            </View>
          )}
        />
      </View>)}
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',

  },
  text: {
    fontSize: 20,
    color: '#101010',
    marginTop: 60,
    fontWeight: '700'
  },
  listItem: {
    //marginTop: 10,
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
  },
  groupText:{
    backgroundColor: 'grey', 
    width: '50%', 
    alignItems: 'center'
  },
  profilText:{
    backgroundColor: '#d3d3d3',
    width: '50%', 
    alignItems: 'center'
  }
});
