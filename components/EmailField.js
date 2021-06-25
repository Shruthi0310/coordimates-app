import React, { Component, useLayoutEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert} from 'react-native';
import { Chip, Selectize as ChildEmailField } from 'react-native-material-selectize';
import { data, auth, db, ad} from '../firebase';
import {Avatar} from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';


 class EmailField extends Component {
  static defaultProps = {
    onChipClose: () => {},
    onSelect: () => {},
    onChosen: () => {}
  };

  constructor(props) {
    super(props);
    this.state= {
        "members" : [],
        "groupName": '',
        "imageUrl": '',
    }
    
    this.createGroup = this.createGroup.bind(this);
    
    
  }

  getSelectedEmails = () => this._childEmailField.getSelectedItems().result;

  onChipClose = onClose => {
    const { onChipClose } = this.props;
    onChipClose(this.getSelectedEmails().length > 1);
    onClose();
  }

  

  
  createGroup() {

       if(!this.state.groupName) {
           alert("Please enter group name")
       } else if(!this.state.members) {
           alert("Please select members")
       } else {
      
      const currUser = auth?.currentUser?.email
      const userRef = db.collection('Users').doc(currUser)
      userRef.update({
        Groups: ad.FieldValue.arrayUnion(this.state.groupName)
      });

      this.state.members.push(currUser);
      for(var i=0; i < this.state.members.length-1; i++) {
        const otherRef = db.collection('Users').doc(this.state.members[i])
         otherRef.update({
         Groups: ad.FieldValue.arrayUnion(this.state.groupName)
       });

       db.collection('Users').doc(this.state.members[i]).collection('groups')
       .doc(this.state.groupName).set({users: this.state.members, imageUrl: this.state.imageUrl})
      }

     
      
      db.collection('Groups').doc(this.state.groupName).set({users: this.state.members,})

      db.collection('Users').doc(currUser).collection('groups')
      .doc(this.state.groupName).set({users: this.state.members, imageUrl: this.state.imageUrl})

       }

       
       Alert.alert(
        'Group Created',
        '',
        [
          {text: 'OK', onPress: () => console.log('ok')},
        ],
        {cancelable: false},
      );

  }
  
  

  render() {
    const { items } = this.props;
    

  
    return (

      <View>
          <TouchableOpacity
          onPress={(this.createGroup)}
          >
          <View style={{marginLeft:300, top: 0}}>
          <Text style={{color: "blue", fontSize:18}}> Done </Text>
          </View>
          </TouchableOpacity>
          <View>
            <Text style= {{fontSize:12, color:"#767676"}}>Group Name:</Text>
            <TextInput
            style={{fontSize:16, borderBottomColor: '#d3d3d3',
            borderBottomWidth: 1, padding: 6 }}
            placeholder="Please enter group name"
            onChangeText = {name => this.setState({groupName: name})}
            ></TextInput>
        </View>
        <View style={{top: 10}}>
        <Text style= {{fontSize:12, color:"#767676"}}>Group Image Url (Optional):</Text>
            <TextInput
            style={{fontSize:16, borderBottomColor: '#d3d3d3',
            borderBottomWidth: 1, padding: 6 }}
            placeholder="Please enter image url"
            onChangeText = {url => this.setState({imageUrl: url})}
            ></TextInput>
        </View>
        <ChildEmailField
          ref={c => this._childEmailField = c}
          containerStyle={styles.container}
          chipStyle={styles.chip}
          chipIconStyle={styles.chipIcon}
          itemId="email"
          items={items}
          label="Members email id"
          listStyle={styles.list}
          textInputProps={{
          placeholder: 'Add members',
          }}
          onChangeSelectedItems = {(selectedItems)=> this.setState({members: selectedItems.result})}
          renderRow={(id, onPress, items) => (
            <TouchableOpacity
                activeOpacity={0.6}
                key={id}
                onPress={onPress}
                style={styles.listRow}>
                   
              <View style={styles.listWrapper}>
                {/* <View style={styles.listIcon}/> */}
                <Avatar
                    avatarStyle={{ borderColor: '#d3d3d3', borderWidth: 1 }}
                    size="medium"
                    rounded
                    source={{
                      uri:'https://icon-library.com/images/default-user-icon/default-user-icon-4.jpg'
                    }} />
                <View style={{marginLeft: 10, flexDirection: 'column'}}>
                  <Text style={styles.listEmailText}>{id}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          renderChip={(id, onClose, item, style, iconStyle) => (
            <Chip
              key={id}
              iconStyle={iconStyle}
              onClose={() => this.onChipClose(onClose)}
              text={id}
              style={style}
            />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chip: {
    paddingRight: 2
  },
  chipIcon: {
    height: 24,
    width: 24
  },
  list: {
    backgroundColor: '#fff',
    position: 'absolute',
    width:'100%'
  },
  listRow: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 20
  },
  listWrapper: {
    flexDirection: 'row'
  },
  listIcon: {
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
    height: 40,
    width: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  listInitials: {
    fontSize: 20,
    lineHeight: 24,
    color: '#fff'
  },
  listEmailText: {
    color: 'grey',
    fontSize: 14,
    lineHeight: 21,
    top: 15
  }
});

export default EmailField