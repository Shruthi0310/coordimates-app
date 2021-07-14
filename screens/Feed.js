import React, { useEffect, useState, useLayoutEffect } from 'react'
import { TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {Text, View,FlatList, Image, Linking,} from 'react-native'
import {Icon, ButtonGroup} from 'react-native-elements'
import { Modal } from 'react-native-paper'
import { db, auth, ad} from '../firebase';
import { AntDesign } from '@expo/vector-icons'
import SimpleSelectButton from 'react-native-simple-select-button';

function Feed({navigation}) {
    const [places, setPlaces] = useState([])
    const [fullPlaces, setfullPlaces] = useState([])
    const [visible, setVisible] = useState(false)
    const[area, setArea] = useState('')
    const[price, setPrice] = useState('')
    const[outorin, setOutorin] = useState('')
    const[activity, setActivity] = useState('')
    const[rating, setRating] = useState('')

  const price_list = [
    { label: "$", value: "$" },
    { label: "$$", value: "$$" },
    { label: "$$$", value: "$$$" },
  ];

  const area_list = [
    { label: "North", value: "north" },
    { label: "South", value: "south" },
    { label: "East", value: "east" },
    { label: "West", value: "west" },
    { label: "Central", value: "central" },
  ]

  const outorin_list = [
    { label: "Outdoors", value: "out" },
    { label: "Indoors", value: "in" },
  ]

  const activity_list =[
    { label: "Games & Sports", value: "Games & Sports" },
    { label: "Shop", value: "shop" },
    { label: "Nature & Parks", value: "Nature & Parks" },
    { label: "Eat", value: "eat" },
    { label: "Arts & Culture", value: "Arts & Culture" },
    { label: "Sightseeing", value: "sightseeing" },
  ]

  const rating_list = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
  ]

    function showModal(){
      setVisible(!visible)
    }

    function hideModal(){
      setVisible(false)
    }
    

    useEffect(() => {
        var place =[];
        db.collection('Places').get()
        .then(next=>{
            next.forEach( x => {
                place.push(x.data())
              }) 
              setPlaces(place)
              setfullPlaces(place)
        })
    }, [])

    useLayoutEffect(() => {

        navigation.setOptions({
        
          headerRight: () => (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
              style={{marginRight: 10}}
              onPress={showModal}
            >
              <Icon
                name="filter-outline"
                type="ionicon"
                color='blue'
                iconStyle={{ fontSize: 30 }}
              ></Icon>

            </TouchableOpacity>
             
            </View>
          )
        })
      })


      function applyFilter(){
        var arr = [];
        setPlaces([])
        const hello = ref.where("price", "==", price)
        .where("outorin", "==", outorin)
        .where('area', "==", area )
        .where('type', '==', activity)   //add ratings after added to database
        .get()
        .then(query => {
          query.forEach( doc => {
            arr.push(doc.data())
          })
          //
           setVisible(false)
           setPlaces(arr)
        })
      }

      function clearFilter(){
        setVisible(false)
        setPlaces([])
        setPlaces(fullPlaces)
      }
    return (
       <View style={{flexDirection: 'row'}}>
           
           <FlatList
            data={places}
            keyExtractor= {item => item.id}
            renderItem={({ item }) => (
                <View>
                   <TouchableOpacity  style={styles.listItem}>
                   <Image
                      style={{width: 300,height:200, borderRadius: 30}}
                      source={{uri: 'https://cdn-cdmoj.nitrocdn.com/aMXvDVbOTxUQVHZUrOLYcprbySihZhas/assets/static/optimized/blog/wp-content/uploads/2017/04/00c2bc583cc64f6563be675617e2d6e1.Gardens-by-the-Bay-Singapore.jpg'}}
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


           <Modal visible={visible} onDismiss={hideModal} style={styles.Modal}>
          <View style= {{marginLeft: 20, marginRight: 20}}>
           <Text style={{fontWeight: 'bold'}}>Filter By:</Text>
            <Text>Price:</Text>
           <FlatList
           horizontal={true}
          data={price_list}
          keyExtractor={item => item.value}
          extraData={price}
          renderItem={
            ({ item }) => 
            <View style={{padding: 5, width:50}}>
              <SimpleSelectButton
                onPress={() => setPrice(item.value)}
                isChecked={price === item.value}
                text={item.label}
                textSize={10}
                buttonDefaultColor="#e5e5e5"
                buttonSelectedColor="cadetblue"
                textDefaultColor="#333"
                textSelectedColor="#fff"

              />
              </View>
              }
            />
            <Text>Area:</Text>
            <FlatList
           horizontal={true}
          data={area_list}
          keyExtractor={item => item.value}
          extraData={area}
          renderItem={
            ({ item }) => 
            <View style={{padding:3, width:60}}>
              <SimpleSelectButton
                onPress={() => setArea(item.value)}
                isChecked={area === item.value}
                text={item.label}
                textSize={10}
                buttonDefaultColor="#e5e5e5"
                buttonSelectedColor="cadetblue"
                textDefaultColor="#333"
                textSelectedColor="#fff"
              />
              </View>
              }
            />
            <Text>Activity:</Text>
             <FlatList
           numColumns={3}
          data={activity_list}
          keyExtractor={item => item.value}
          extraData={activity}
          renderItem={
            ({ item }) => 
            <View style={{padding:3, width:100}}>
              <SimpleSelectButton
                onPress={() => setActivity(item.value)}
                isChecked={activity === item.value}
                text={item.label}
                textSize={10}
                buttonDefaultColor="#e5e5e5"
                buttonSelectedColor="cadetblue"
                textDefaultColor="#333"
                textSelectedColor="#fff"
              />
              </View>
              }
            />

        <Text>Rating:</Text>
             <FlatList
           horizontal={true}
          data={rating_list}
          keyExtractor={item => item.value}
          extraData={rating}
          renderItem={
            ({ item }) => 
            <View style={{padding: 5, width:60}}>
              <SimpleSelectButton
                onPress={() => setRating(item.value)}
                isChecked={rating === item.value}
                text={item.label}
                textSize={10}
                buttonDefaultColor="#e5e5e5"
                buttonSelectedColor="cadetblue"
                textDefaultColor="#333"
                textSelectedColor="#fff"
              />
              </View>
              }
            />
        <Text>Location:</Text>
        <FlatList
           horizontal={true}
          data={outorin_list}
          keyExtractor={item => item.value}
          extraData={outorin}
          renderItem={
            ({ item }) => 
             <View style={{padding: 5, width: 100}}>
              <SimpleSelectButton
                onPress={() => setOutorin(item.value)}
                isChecked={outorin === item.value}
                text={item.label}
                textSize={10}
                buttonDefaultColor="#e5e5e5"
                buttonSelectedColor="cadetblue"
                textDefaultColor="#333"
                textSelectedColor="#fff"
              />
              </View>
              }
            />
              <View style= {{flexDirection: 'row'}}>
              <TouchableOpacity style= {{marginLeft: '15%'}}
                onPress={clearFilter}
              >
                <Text style={{color:'red', fontWeight: 'bold'}}>Clear filter</Text>
              </TouchableOpacity>
              <TouchableOpacity style= {{marginLeft: '15%'}}
                onPress={applyFilter}
              >
                <Text style={{color:'red', fontWeight: 'bold'}}>Apply</Text>
              </TouchableOpacity>
              </View>
              </View>
             </Modal>
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
        flexDirection: "column",
        alignItems: 'center',
        borderColor: '#e06666',
        borderWidth: 1,
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
      },
      Modal:{
        width: '100%',
        height:'85%',
        backgroundColor: '#ADD8E6',
        marginLeft: '20%',
        marginTop: 0
      }
      
})

export default Feed;