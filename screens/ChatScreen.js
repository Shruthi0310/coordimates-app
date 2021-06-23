import React, {useState, useLayoutEffect, useCallback, useEffect} from 'react'
import { View, Text, TouchableOpacity, Button} from "react-native"
import {db, auth, data} from '../firebase'
import {Avatar} from 'react-native-elements'
import {GiftedChat} from 'react-native-gifted-chat'

const ChatScreen= ({navigation})=>{
    const [messages, setMessages] = useState([]);

     useEffect(() =>{
         setMessages([
             {
                 _id: 1,
                 text: 'Hello Shruthi',
                 createdAt: new Date(),
                 user: {
                     _id:2,
                     name: 'React Native',
                     avatar: 'https://placeimg.com/140/140/any',
                 },
             },
         ])
     }, [])

     const onSend = useCallback( (messages =[]) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages))
     

     const {
         _id,
         createdAt,
         text,
         user
     } = messages[0]

     db.collection('chats').add({
         _id,
         createdAt,
         text,
         user
     })
    }, [])


    useLayoutEffect(() => {
        
        navigation.setOptions({
        headerLeft: () => (
        <View style={{ marginLeft: 20,}}>
        <Avatar
        rounded
        source={{
        uri: auth?.currentUser?.photoURL,
        }}
        />
        </View>
        ),
        headerRight: () => (
        <TouchableOpacity style={{
        marginRight: 10
        }}
        onPress={() => navigation.navigate('Choose Your Place')}
        >

        <Text style ={{color: "blue", fontSize:18}}>choose</Text>  
        {/* <Icon icon={logoutOutlined}/> */}
        </TouchableOpacity>
        )
        })
    

        }, [navigation]);

        useLayoutEffect(() => {
            const unsubscribe = db.collection('chats').orderBy('createdAt', 'desc').onSnapshot(snapshot => setMessages(
            snapshot.docs.map(doc => ({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
            }))
            ));
            return unsubscribe;
            }, [])

    return(
        // <Text>Chat screen</Text>
        
        <GiftedChat
          messages={messages}
          showUserAvatar={true}
          alwaysShowSend
          onSend = {messages => onSend(messages)}
          user ={{
            _id: auth?.currentUser?.email,
            name: auth?.currentUser?.displayName,
            avatar: auth?.currentUser?.photoURL
          }}
        />
    );
}

export default ChatScreen;