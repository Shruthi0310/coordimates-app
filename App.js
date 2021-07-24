import React from 'react';
import { Icon } from 'react-native-elements'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ChatScreen from './screens/ChatScreen';
import GroupPage from './screens/GroupPage';
import Form from './screens/Form';
import AddGroup from './screens/AddGroup';
import AddGroupPage from './screens/AddGroupPage';
import WaitingPage from './screens/WaitingPage';
import ListOfPlaces from './screens/ListOfPlace';
import Wheel from './screens/SpinTheWheel';
import SelectedWheel from './screens/SelectedWheel';
import ProfileScreen from './screens/Profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EmailField from './components/EmailField';
import Feed from './screens/Feed';
import CollectionPlaces from './screens/CollectionPlaces';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();



export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator >
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerTintColor: '#d3d3d3', headerStyle: { backgroundColor: "#261345" } }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ headerTintColor: '#d3d3d3', headerStyle: { backgroundColor: "#261345" } }} />
                <Stack.Screen name="Groups" component={GroupPage} />
                <Stack.Screen name="Chat" component={ChatScreen} />
                <Stack.Screen name="Choose Your Place" component={Form} />
                <Stack.Screen name="Add Group" component={AddGroup} />
                <Stack.Screen name='Create Group' component={AddGroupPage} />
                <Stack.Screen name='Waiting' component={WaitingPage} options={{ headerShown: false }} />
                <Stack.Screen name='List Of Places' component={ListOfPlaces} options={{ headerShown: false }} />
                <Stack.Screen name='Spin The Wheel' component={Wheel} options={{ headerShown: false }} />
                <Stack.Screen name='Selected Wheel' component={SelectedWheel} options={{ headerShown: false }} />
                <Stack.Screen name='Profile' component={ProfileScreen} />
                <Stack.Screen name='EmailFiel' component ={EmailField} />
                <Stack.Screen name="Feed" component={Feed} />
                <Stack.Screen name="Collection" component={CollectionPlaces} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}