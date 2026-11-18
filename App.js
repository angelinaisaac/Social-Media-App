import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Pressable, Alert, Button, Image, TouchableOpacity, Modal} from 'react-native';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useState, useEffect } from 'react';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system"
import LoginScreen from './Components/Login';
import RegisterScreen from './Components/Register';
import HomeScreen from './Components/Home';
import AccountSettings from './Components/AccountSettings';
import UserProfile from './Components/Profile';
import PostPhoto from './Components/PostPhoto';
import PostAudio from './Components/PostAudio';
import DisplayAudio from './Components/ShowAudio';
import PostText from './Components/PostText';
import DisplayText from './Components/ShowText';
import proto from './Components/proto'

import styles from './styles';



//initalises databases
const initaliseDatabase = async(db) =>{
  try{
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS userCreds(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
        );
        
      CREATE TABLE IF NOT EXISTS accountInfo(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT DEFAULT ' ',
        bio TEXT,
        profilePic BLOB DEFAULT NULL,
        userCredsID INTEGER,
        FOREIGN KEY (userCredsID) REFERENCES userCreds(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS postPhoto(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        caption TEXT,
        photo BLOB DEFAULT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        accountInfoID INTEGER NOT NULL, 
        FOREIGN KEY (accountInfoID) REFERENCES accountInfo(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS postAudio(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        caption TEXT,
        audio BLOB DEFAULT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        accountInfoID INTEGER NOT NULL, 
        FOREIGN KEY (accountInfoID) REFERENCES accountInfo(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS postText(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        parent_id INTEGER,
        accountInfoID INTEGER NOT NULL,
        FOREIGN KEY(parent_id) REFERENCES postText(id) ON DELETE CASCADE,
        FOREIGN KEY (accountInfoID) REFERENCES accountInfo(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS comment(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        accountInfoID INTEGER NOT NULL,
        textID INTEGER NOT NULL,
        FOREIGN KEY (accountInfoID) REFERENCES accountInfo(id) ON DELETE CASCADE,
        FOREIGN KEY (textID) REFERENCES postText(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS userPosts(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        textId INTEGER ,
        FOREIGN KEY (textId) REFERENCES postText(id) ON DELETE CASCADE,
        audioId INTEGER ,
        FOREIGN KEY (audioId) REFERENCES postAudio(id) ON DELETE CASCADE,
        photoId INTEGER ,
        FOREIGN KEY (photoId) REFERENCES postPhoto(id) ON DELETE CASCADE,
        accountInfoID INTEGER NOT NULL,
        FOREIGN KEY (accountInfoID) REFERENCES accountInfo(id) ON DELETE CASCADE
      );
        `);
        console.log("usercreds initalised");
  }catch(error){
    console.log("Error: ", error);
  }
};

//creates stack navigator
const Stack = createStackNavigator();



//display app
export default function App() {
  return (
    <SQLiteProvider databaseName='hopeCoreDatabase' onInit={initaliseDatabase}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
          <Stack.Screen name = 'Login' component={LoginScreen} options = {{headerShown:false ,gestureEnabled:false,animation:'fade'}}/>
          <Stack.Screen name = 'Register' component={RegisterScreen} options = {{headerShown:false,gestureEnabled:false,animation:'fade'}}/>
          <Stack.Screen name = 'Home' component = {HomeScreen} options = {{headerShown:false,gestureEnabled:false,animation:'fade'}}/>
          <Stack.Screen name = 'Account' component={AccountSettings} options = {{headerShown:false,gestureEnabled:false,animation:'fade'}}/>
          <Stack.Screen name = 'Profile' component={UserProfile} options = {{headerShown:false,gestureEnabled:false,animation:'fade'}}/>
          <Stack.Screen name = 'Photo' component={PostPhoto} options = {{headerShown:false,gestureEnabled:false,animation:'fade'}}/>
          <Stack.Screen name = 'Audio' component={PostAudio} options = {{headerShown:false,gestureEnabled:false,animation:'fade'}}/>
          <Stack.Screen name = 'Text' component={PostText} options = {{headerShown:false,gestureEnabled:false,animation:'fade'}}/>
          <Stack.Screen name = 'DisplayAudio' component={DisplayAudio} options = {{headerShown:false,gestureEnabled:false,animation:'fade'}}/>
          <Stack.Screen name = 'DisplayText' component={DisplayText} options = {{headerShown:false,gestureEnabled:false,animation:'fade'}}/>
          <Stack.Screen name = "Registering" component={proto}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}

