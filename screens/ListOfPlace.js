import React, { useEffect, useState } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native';
import {Text, View,FlatList, Image, Linking,} from 'react-native'
import {Icon} from 'react-native-elements'
import { db, auth, ad} from '../firebase';
import { Modal } from 'react-native-paper'
import { Rating} from 'react-native-elements';

function ListOfPlaces({navigation}) {
    const [places, setPlaces] = useState([])
    const[visible, setVisible] = useState(false)
    const[review, setReview] = useState('')
    const[loading, setLoading] = useState(false)
    const [revPlace, setrevPlace] = useState('')

    const currUser = auth?.currentUser?.email;
    var grp;
    var bool = true;
    
    useEffect(() => {
        var place =[];
        const ref = db.collection('users').doc(currUser).get()
        .then(doc => {
            grp = doc.data().group
            db.collection('Groups').doc(doc.data().group).get().then(
                query => {
                    //console.log(query.data().ids)
                    for(var i=0; i< query.data().ids.length; i++){
                      db.collection('Places').where("id", "==", query.data().ids[i]).get()
                      .then(next => {
                        next.forEach(x => {
                          place.push(x.data())
                        })
                        setPlaces(place)
                      })
                    }
                  //  db.collection('Places').where("id", "in", query.data().ids).get()
                  //  .then(next => {
                  //     next.forEach( x => {
                  //       place.push(x.data())
                  //       //console.log(x.data())
                  //     }) 
                  //     setPlaces(place)
                      
                  //   })
                   //can save the place inside group firebase
                   //console.log(place);
                }   
            )
            
        })

    }, [])





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
        //clearInterval(interval);
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

    function openReviews(rev){
      setVisible(!visible)
      setLoading(true)
      if(rev.reviews == null) {
        setReview([{name: 'No reviews yet', review: 'Be the first to leave a review', rating: 5}])
      }else{
        setReview(rev.reviews)
      }
      setrevPlace(rev.id)
      setLoading(false)
    }

    function hideReview(){
      setVisible(!visible)
    }

    return (
       <View style={{paddingBottom: '30%'}}>
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

                <TouchableOpacity style={styles.listItem}
                   onPress = {() => openReviews(item)}
                >
                   <Image
                      style={{width: 300,height:200, borderRadius: 30}}
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

          {!loading && (<Modal visible={visible} onDismiss={hideReview} style={styles.Modal}>

            <Text style={{fontWeight: 'bold', fontSize: 25, marginLeft: 10, paddingBottom: 10}}>
                          {`${revPlace}`}
                          </Text>
                         <Text style={{fontSize: 20, marginBottom: 20, marginLeft: 10}}>Reviews:</Text>
                         <FlatList
                         data={review}
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
           </Modal>)}
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
        height: 500,
        width: 500, 
        backgroundColor: 'white',
        marginTop: '25%'
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
})

export default ListOfPlaces;