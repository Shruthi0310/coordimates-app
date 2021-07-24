import React, { useEffect, useState, useLayoutEffect, useReducer } from 'react'
import { TouchableOpacity, StyleSheet, ScrollView, Keyboard} from 'react-native';
import {Text, View,FlatList, Image, Linking,} from 'react-native'
import {Icon, Input} from 'react-native-elements'
import { Modal } from 'react-native-paper'
import { db, auth, ad} from '../firebase';
import SimpleSelectButton from 'react-native-simple-select-button';
import { Rating} from 'react-native-elements';


function CollectionPlaces({navigation}) {
    const [places, setPlaces] = useState([])
    const [review, setReview] = useState(false)
    const[rev, setRev]= useState([])
    const[loading, setLoading]= useState(false)
    const [placeName, setplaceName] = useState('')
    const[leaveaRev, setLeaveaRev] = useState(false)
    const [ userRating, setuserRating] = useState('3')
    const[ userReview, setuserReview] = useState('')
    const [state, setState] = useState({});
    useEffect(() => {
     
        var place =[]
        const currUser = auth?.currentUser?.email;
        db.collection('Users').doc(currUser).get()
        .then(doc=>{
           for(var i=0; i<doc.data().suggestedPlaces.length; i++) {
               db.collection('Places').where('id', '==', doc.data().suggestedPlaces[i])
               .get().then(query => {
                   query.forEach(x =>{
                      place.push(x.data())
                   })
                   setPlaces(place)
               })
           }
        })
        return () => {
          setState({}); // This worked for me
        };
    }, [])


   
    
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
       <View style={{flexDirection: 'row'}}>
         
           <FlatList
            data={places}
            keyExtractor= {item => item.id}
            renderItem={({ item }) => (
                <View>
                   <TouchableOpacity  style={styles.listItem} onPress={() => openReview(item)}>
                   <Image
                      style={{width: 300,height:200, borderRadius: 30}}
                      source={{uri: item.image != null? item.image: 'https://cdn-cdmoj.nitrocdn.com/aMXvDVbOTxUQVHZUrOLYcprbySihZhas/assets/static/optimized/blog/wp-content/uploads/2017/04/00c2bc583cc64f6563be675617e2d6e1.Gardens-by-the-Bay-Singapore.jpg'}}
                      resizeMode="contain"
                   />
                   <Text style={styles.listItemText}>{`${item.id}`}</Text>
                   <Text>Place description</Text>
                   <Rating
                              ratingCount={5}
                              imageSize={20}
                              startingValue={Number(item.rating)}
                              readonly={true}
                             ></Rating>
                    <Text style={{color: 'blue'}}
                           onPress={() => Linking.openURL(item.web != null? item.web: 'http://google.com')}>
                        Link to page website</Text>
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

export default CollectionPlaces;