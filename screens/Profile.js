import React, { useState, useEffect } from 'react'
import { ImageBackground } from 'react-native'
import { ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { View, Text, StyleSheet, Image, Modal } from 'react-native'
import { Input, Button, Avatar } from 'react-native-elements'
import { auth, db } from '../firebase'
import DialogInput from 'react-native-dialog-input'

function ProfileScreen({ navigation }) {
    const [pass, setPass] = useState(false)
    const [name, setName] = useState(false)
    const [email, setEmail] = useState(false)
    const [image, setImage] = useState(false)

    const user = auth?.currentUser


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

    // function submitEmail(text) {
    //     setEmail(!email);
    //     console.log(text)
    // }

    // function showEmail() {
    //     setEmail(!email);
    // }

    function submitImage(text) {
        setImage(!image);
        user.updateProfile({
            photoURL: text
        })
    }

    function showImage() {
        setImage(!image);
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

                    {/* <View style={styles.item}>
                    <View style={styles.iconContent}>
                        <Image style={styles.icon} source={{ uri: 'https://img.icons8.com/bubbles/50/000000/email--v1.png' }} />
                    </View>
                    <View style={styles.infoContent}>
                        <TouchableOpacity onPress={showEmail}>
                            <Text style={styles.info}>Change Email</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <DialogInput isDialogVisible={email}
                    title={"Change Email"}
                    message={"Please enter new email"}
                    hintInput={"email"}
                    submitInput={(inputText) => {
                        submitEmail(inputText)
                    }
                    }
                    closeDialog={showEmail}>
                </DialogInput> */}
                    {/* <TouchableOpacity style={styles.logout} onPress={signOut}>
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity> */}
                </View>

            </View>
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
    }

});


export default ProfileScreen