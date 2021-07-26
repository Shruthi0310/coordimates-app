import React, { useEffect, useState, useLayoutEffect, useReducer } from 'react'
import { TouchableOpacity, StyleSheet, ScrollView, Keyboard} from 'react-native';
import {Text, View,FlatList, Image, Linking,} from 'react-native'
import {Icon, Input} from 'react-native-elements'
import { Modal } from 'react-native-paper'
import { db, auth, ad} from '../firebase';
import SimpleSelectButton from 'react-native-simple-select-button';
import { Rating} from 'react-native-elements';


function Feed({navigation}) {
    const [places, setPlaces] = useState([])
    const [fullPlaces, setfullPlaces] = useState([])
    const [visible, setVisible] = useState(false)
    const[area, setArea] = useState('')
    const[price, setPrice] = useState('')
    const[outorin, setOutorin] = useState('')
    const[activity, setActivity] = useState('')
    const[rating, setRating] = useState('')
    const [review, setReview] = useState(false)
    const[rev, setRev]= useState([])
    const[loading, setLoading]= useState(false)
    const [placeName, setplaceName] = useState('')
    const[leaveaRev, setLeaveaRev] = useState(false)
    const [ userRating, setuserRating] = useState('')
    const[ userReview, setuserReview] = useState('')
    const [refresh, setRefresh] = useState(false)

    function onRefresh(){
      setRefresh(!refresh)
   }

  const price_list = [
    { label: "$", value: "15" },
    { label: "$$", value: "40" },
    { label: "$$$", value: "200" },
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
    { label: "Games & Sports", value: "Games and Sports" },
    { label: "Shop", value: "shop" },
    { label: "Nature & Parks", value: "Nature and Parks" },
    { label: "Eat", value: "eat" },
    { label: "Arts & Culture", value: "Arts and Culture" },
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
              {/* <TouchableOpacity
              style={{marginRight: 10}}
              onPress={onRefresh}
            >
              <Icon
                name="refresh-outline"
                type="ionicon"
                color='blue'
                iconStyle={{ fontSize: 30 }}
              ></Icon>
            </TouchableOpacity> */}

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
        var ref = db.collection('Places')

        if(outorin != '') {
          ref = ref.where("outorin", "==", outorin)
        }

       
        

        if(area != '') {
          ref = ref.where('area', "==", area )
        }
        if(activity != '') {
          ref= ref.where('type', '==', activity)   
        }

        if(price != '') {
          ref = ref.get()
          .then(query => {
            query.forEach( doc => {
              if(Number(price) >= doc.data().price) {
                 if(rating != '') {
                   if(Number(rating) <= doc.data().rating) {
                  arr.push(doc.data())
                   }
                 } else{
                   arr.push(doc.data())
                 }
              }
            })
            //
             setVisible(false)
             setPlaces(arr)
          })
         }else{
           ref=ref.get()
           .then(query => {
             query.forEach(doc => {
              if(rating != '') {
                if(Number(rating) <= doc.data().rating) {
               arr.push(doc.data())
                }
              } else{
                arr.push(doc.data())
              }
             })
             setVisible(false)
             setPlaces(arr)
           })
         }
        
      }

      function clearFilter(){
        setVisible(false)
        setPlaces([])
        setPlaces(fullPlaces)
      }

      function hideReview(){
        setReview(false)

      }

      function leaveAReview(){
        setLeaveaRev(!leaveaRev)
      }


      function openReview(rev){
        setReview(!review)
        setLoading(true)
        if(rev.reviews == null) {
          setRev([{name: 'No reviews yet', review: 'Be the first to leave a review', rating: 5}])
        }else{
          setRev(rev.reviews)
        }
        setplaceName(rev.id)
        // console.log(rev.id)
        // console.log(rev.reviews)
        setLoading(false)
        }

     function submitReview(){
      const userId = auth?.currentUser.displayName;
      db.collection('Places').where('id', '==', placeName).get()
      .then(query => query.forEach(doc => {
       db.collection('Places').doc(doc.id).update({
           reviews: ad.FieldValue.arrayUnion({
             name: userId,
             rating: userRating,
             review: userReview
           })
         })
      }

   ))
      setLeaveaRev(!leaveaRev)
     }
     
    return (
       <View style={{flexDirection: 'column'}}>
          <Text style={{alignSelf: 'center', color: 'grey'}}>Please click on the places to view reviews</Text>
           <FlatList
            data={places}
            keyExtractor= {item => item.id}
            renderItem={({ item }) => (
                <View>
                   <TouchableOpacity  style={styles.listItem} onPress={() => openReview(item)}>
                   <Image
                      style={{width: 300,height:200, borderRadius: 30}}
                      source={{uri: item.image == null?'https://picsum.photos/300/200': item.image}}
                      resizeMode="contain"
                   />
                   <Text style={styles.listItemText}>{`${item.id}`}</Text>
                   <Text style={{fontStyle: 'italic'}}>{`${item.description != null? item.description: 'No description yet'}`}</Text>
                   <Text>Location: {`${item.area}`}</Text>
                   <Text>{`${item.price <= 15 ? '$': ((item.price >15 && item.price <= 40)? '$$': '$$$')}`}</Text>
                   <Rating
                              ratingCount={5}
                              imageSize={20}
                              startingValue={Number(item.rating)}
                              readonly={true}
                             ></Rating>
                    <Text style={{color: 'blue'}}
                           onPress={() => Linking.openURL(item.web != null? item.web:'http://google.com')}>
                        Go to website</Text>
                   </TouchableOpacity>
                 
                </View>
            )}
           >
           </FlatList>
           
           {!loading && (<Modal visible={review} onDismiss={hideReview} style={styles.reviewModal}>
               <View style={{width: 500, height: 450, paddingBottom: 10, paddingTop: 10 }}>
                        <Text style={{fontWeight: 'bold', fontSize: 25, marginLeft: 10, paddingBottom: 10}}>
                          {`${placeName}`}
                          </Text>
                         <View style={{flexDirection: 'row'}}>
                         <Text style={{fontSize: 20, marginBottom: 20, marginLeft: 10}}>Reviews:</Text>
                         <TouchableOpacity style={styles.leaveReview} onPress={leaveAReview}>
                           <Text style={styles.leaveReviewText}>Leave a review</Text>
                         </TouchableOpacity>
                         </View>
                         <FlatList
                         data={rev}
                         keyExtractor={item => item.name}
                         renderItem={({ item }) => (
                           <TouchableOpacity>
                           <View style={styles.reviewItem}>
                              <Text style={{fontSize:18, fontWeight:'bold', textTransform: 'uppercase'}}>{`${item.name}`}</Text>
                             <Text style={styles.reviewItemText}>"{`${item.review}`}"</Text>
                             <Rating
                              ratingCount={5}
                              imageSize={20}
                              startingValue={Number(item.rating)}
                              readonly={true}
                             ></Rating>
                           </View>
                           </TouchableOpacity>
                         )}
                         >

                         </FlatList>
                         </View>
            </Modal>)}

          <Modal visible={leaveaRev} onDismiss={leaveAReview} style={{width: 500, height: 500, backgroundColor: 'white'}}>
          <Text style={{fontWeight: 'bold', fontSize: 16, marginLeft: 10}}>
            Rating
          </Text>
          <Rating
          onFinishRating={rate => setuserRating(rate)}
          style={{ paddingVertical: 10, marginRight: 280}}
          />
          <Input
        inputContainerStyle={styles.input}
        placeholder='Write your review'
        placeholderTextColor='#c3c3c3'
        label='Review'
        labelStyle={{color:'black'}}
        value={userReview}
        onChangeText={text => setuserReview(text)}
        multiline={true}
        />
        <TouchableOpacity style={{backgroundColor: 'pink', 
          width: 100,height: 30, alignItems: 'center', alignSelf: 'center'}}
            onPress={submitReview}
          >
          <Text style={{fontSize: 19, color: 'white'}}>Submit</Text>
        </TouchableOpacity>
          </Modal>
           
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
        borderColor: 'grey',
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
      Modal:{
        width: 500,
        height:550,
        backgroundColor: '#ADD8E6',
        marginLeft: '20%',
        marginTop: 0
      },
      reviewModal:{
         height: 500,
         width: 500, 
         backgroundColor: 'white',
      },
      reviewItem:{
          width: 400,
          height: 100,
          padding: 20,
          borderBottomColor: 'grey',
          borderBottomWidth: 1,
          borderTopColor: 'grey',
          borderTopWidth: 1
      },
      reviewItemText:{
          fontSize: 18
      },
      leaveReview:{
        borderWidth: 1, 
        borderColor: 'grey', 
        width: 150,
        height: 28,
        backgroundColor: 'pink',
        alignItems: 'center',
        borderRadius: 10,
        marginLeft: 150
      },
      leaveReviewText:{
        fontSize: 19,
        color: 'white'
      },
      input:{
        height: 100,
        width: 400,
         borderColor: 'black',
         borderWidth: 1
      }
      
})

export default Feed;