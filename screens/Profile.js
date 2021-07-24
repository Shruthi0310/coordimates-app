import React, { useState, useEffect, useLayoutEffect } from 'react'
import { ImageBackground } from 'react-native'
import { ScrollView } from 'react-native'
import { TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { View, Text, StyleSheet, Image} from 'react-native'
import { Input, Button, Avatar, Icon } from 'react-native-elements'
import { auth, db, ad } from '../firebase'
import DialogInput from 'react-native-dialog-input'
import { Modal } from 'react-native-paper'
import { FlatList } from 'react-native-gesture-handler'
import { Rating} from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native'

function ProfileScreen({ navigation }) {
    const [pass, setPass] = useState(false)
    const [name, setName] = useState(false)
    const [email, setEmail] = useState(false)
    const [image, setImage] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [visible, setVisible] = useState(false)
    const [places, setPlaces] = useState([])
    const [review, setReview] = useState(false)
    const[rev, setRev]= useState([])
    const[loading, setLoading]= useState(false)
    const [placeName, setplaceName] = useState('')
    const[leaveaRev, setLeaveaRev] = useState(false)
    const [ userRating, setuserRating] = useState('')
    const[ userReview, setuserReview] = useState('')

    const user = auth?.currentUser

    function onRefresh(){
       setRefresh(!refresh)
    } 

    function hideReview(){
        setReview(false)

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
        console.log(rev.id)
        console.log(rev.reviews)
        setLoading(false)
        }

    function leaveAReview(){
        setLeaveaRev(!leaveaRev)
        setReview(!review)
      }

      function submitReview(){
        const userId = auth?.currentUser.displayName;
        db.collection('Places').doc(placeName).update({
          reviews: ad.FieldValue.arrayUnion({
            name: userId,
            rating: userRating,
            review: userReview
          })
        })
        setLeaveaRev(!leaveaRev)
        setReview(!review)
       }
    
    useEffect(()=> {
        let isCancelled = false;
        const currUser = auth?.currentUser?.email;
        db.collection('Users').doc(currUser).get()
        .then(doc=>{
            
            if (!isCancelled) {
                setPlaces(doc.data().suggestedPlaces)
              }
        })

        return () => {
      isCancelled = true;
    };
    })

    useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
              style={{marginRight: 10}}
              onPress={onRefresh}
            >
              <Icon
                name="refresh-outline"
                type="ionicon"
                color='blue'
                iconStyle={{ fontSize: 30 }}
              ></Icon>
            </TouchableOpacity>
            </View>
          )
        })
      })

    function submitPass(text) {
        setPass(!pass);
        user.updatePassword(text).then(() => {
          
        }).catch((error) => {

        });
    }

    function showPass() {
        setPass(!pass);
    }

    function submitName(text) {
        setName(!name);
        user.updateProfile({
            displayName: text
        }) 
    }

    function showName() {
        setName(!name);
    }

    function submitImage(text) {
        setImage(!image);
        user.updateProfile({
            photoURL: text
        })
    }

    function showImage() {
        setImage(!image);
    }


    function showCollection(){
          setVisible(!visible)
    }

    return (
        <View >
            <View>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Image style={styles.avatar}
                            source={{ uri: user.photoURL != null ? user.photoURL : 'https://bootdey.com/img/Content/avatar/avatar6.png' }} />

                        <Text style={styles.name}>{`${user.displayName}`}</Text>
                        <Text style={styles.userInfo}>{`${user.email}`}</Text>
                    </View>
                </View>

                <View style={styles.body}>
                    <View style={styles.item}>
                        <View style={styles.iconContent}>
                            <Image style={styles.icon} source={{ uri: "https://img.icons8.com/plumpy/24/000000/password.png" }} />
                        </View>
                        <View style={styles.infoContent}>
                            <TouchableOpacity onPress={showPass}>
                                <Text style={styles.info}>Change Password</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <DialogInput isDialogVisible={pass}
                        submitText='Change'
                        title={"Change Password"}
                        message={"Please enter new password"}
                        hintInput={"password"}
                        submitInput={(inputText) => {
                            submitPass(inputText)
                        }
                        }
                        closeDialog={showPass}>
                    </DialogInput>

                    <View style={styles.item}>
                        <View style={styles.iconContent}>
                            <Image style={styles.icon} source={{ uri: 'https://img.icons8.com/color/70/000000/administrator-male.png' }} />
                        </View>
                        <View style={styles.infoContent}>
                            <TouchableOpacity onPress={showImage}>
                                <Text style={styles.info}>Change Profile Picture</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <DialogInput isDialogVisible={image}
                        submitText='Change'
                        title={"Change Profile Picture"}
                        message={"Please enter new image url"}
                        hintInput={"image url"}
                        submitInput={(inputText) => {
                            submitImage(inputText)
                        }
                        }
                        closeDialog={showImage}>
                    </DialogInput>

                    <View style={styles.item}>
                        <View style={styles.iconContent}>
                            <Image style={styles.icon} source={{ uri: "https://img.icons8.com/fluent/48/000000/username.png" }} />
                        </View>
                        <View style={styles.infoContent}>
                            <TouchableOpacity onPress={showName}>
                                <Text style={styles.info}>Change Username</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <DialogInput isDialogVisible={name}
                        submitText='Change'
                        title={"Change Username"}
                        message={"Please enter new username"}
                        hintInput={"username"}
                        submitInput={(inputText) => {
                            submitName(inputText)
                        }
                        }
                        closeDialog={showName}>
                    </DialogInput>

                    <View style={styles.item}>
                        <View style={styles.iconContent}>
                            <Image style={styles.icon} source={{ uri: "https://img.icons8.com/bubbles/50/000000/place-marker.png" }} />
                        </View>
                        <View style={styles.infoContent}>
                            <TouchableOpacity onPress = {()=> navigation.navigate('Collection')}>
                                <Text style={styles.info}>Collection of Suggested Places</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                   
                </View>

            </View>
            <Modal visible={visible} onDismiss={showCollection} style={styles.Modal}>
                        <FlatList
                        data={places}
                        keyExtractor= {item => item.id}
                        renderItem={({ item }) => (
                            <View>
                                <TouchableOpacity style={styles.listItem} onPress={() => openReview(item)}>
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

                        {!loading && (<Modal visible={review} onDismiss={hideReview} style={styles.reviewModal}>
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
                         </Modal>)}
                         <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
          </TouchableWithoutFeedback>
        </Modal>

        </View>
    )
}


const styles = StyleSheet.create({
    header: {
        backgroundColor: "#DCDCDC",
    },
    headerContent: {
        padding: 30,
        alignItems: 'center',
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: 10,
    },
    name: {
        fontSize: 22,
        color: "#000000",
        fontWeight: '600',
    },
    userInfo: {
        fontSize: 16,
        color: "#778899",
        fontWeight: '600',
    },
    body: {
        backgroundColor: "#778899",
        height: 600,
        alignItems: 'center',
    },
    item: {
        flexDirection: 'row',
    },
    infoContent: {
        flex: 1,
        alignItems: 'flex-start',
        marginRight: '10%'
    },
    iconContent: {
        flex: 0.5,
        alignItems: 'flex-end',
        paddingRight: 5,
    },
    icon: {
        width: 40,
        height: 40,
        marginTop: 20,
    },
    info: {
        fontSize: 18,
        marginTop: 30,
        color: "#FFFFFF",
        //alignSelf: 'center'
    },
    logout: {
        top: '20%',
        backgroundColor: '#b4a7af',
        width: '100%',
        height: 40,
        flexDirection: 'column'
    },
    logoutText: {
        fontSize: 20,
        color: 'white',
        alignSelf: 'center',
        top: '15%'
    },
    Modal:{
        width: '100%',
        height:'60%',
        backgroundColor: 'pink',
        borderColor: 'grey',
        borderWidth: 1,
        marginRight: 100
      },
      listItem: {
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
      reviewModal:{
        height: 200,
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

});


export default ProfileScreen