
import { useSQLiteContext } from 'expo-sqlite';
import React, { useState , useEffect, useCallback} from 'react';
import { View, Text, TextInput, Pressable, Alert,TouchableWithoutFeedback, Keyboard, Image,Button,FlatList, SafeAreaView} from 'react-native';
import {Audio} from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import styles from '../styles'; 



const UserProfile = ({navigation, route})=>{
  const {user } = route.params;
  const db = useSQLiteContext();

  const [accName, setAccName] = useState('');
  const [accBio, setAccBio] = useState('');
  const [PFP, setPFP] = useState('');
  const [accountInfoID, setAccountInfoID] = useState();
  const [posts, setPosts] = useState([]);
  const defaultImg = require('../images/greypfp.jpg');
  //const {accountName, accountBio, accUser, PFP} = route.params;


  
 const loadAccountInfo = async () => {
  try {
    const userRow = await db.getFirstAsync('SELECT id FROM userCreds WHERE username = ?', [user]);
    if (!userRow) return;
    //setAccountInfoID(userRow.id);

    const userId = userRow.id;
    const accountInfo = await db.getFirstAsync('SELECT * FROM accountInfo WHERE userCredsID = ?', [userId]);
    if (accountInfo) {
      setAccName(accountInfo.name || '');
      setAccBio(accountInfo.bio || '');
      setPFP(accountInfo.profilePic || defaultImg);
      setAccountInfoID(accountInfo.id);
    }
  } catch (error) {
    console.log("Error loading account info:", error);
  }
};

const loadPosts = async (accountInfoID) => {
  try {
    const results = await db.getAllAsync(
      `SELECT 
        postPhoto.id AS postId,
        postPhoto.caption,
        postPhoto.photo,
        postPhoto.timestamp,
        userCreds.username,
        accountInfo.name,
        accountInfo.profilePic
      FROM postPhoto
      JOIN accountInfo ON postPhoto.accountInfoID = accountInfo.id
      JOIN userCreds ON accountInfo.userCredsID = userCreds.id
      WHERE postPhoto.accountInfoID = ?   -- only this user’s posts
      ORDER BY postPhoto.timestamp DESC
      `,
      [accountInfoID]
    );
  setPosts(results);
  }catch(error){

  }

};


const deletePost = (id) => {
  console.log("deletePost not implemented yet", id);
};


useEffect(() => {
        loadAccountInfo();
        //loadPosts(accountInfoID);
      }, []);
    
    useFocusEffect(
        useCallback(()=>{
            loadPosts(accountInfoID);
        },[accountInfoID])
    );



  return(
    <View style = {styles.profileCont}>
      <Text style = {styles.title}>Welcome to your profile {user}!</Text>
      <View style = {styles.pfpProfileCont}>
        <Image style = {styles.changePFP} source = {typeof PFP === 'string'? {uri:PFP}:defaultImg}/>
      </View>
        <Text style={styles.profileText}>{accName}</Text>
        <Text style={styles.usernameText}>@{user}</Text>
        <View style = {styles.bioCont}>
          <FontAwesome name = "quote-left" size={25} /><Text style={styles.profileText}>{accBio}</Text><FontAwesome name = "quote-right" size={25} />
        </View>
        <Button title = "Home" onPress={()=>navigation.navigate('Home',{user:user, accountName:accName, accountBio:accBio, PFP:PFP})}/>
    
    </View>
  );

};
export default UserProfile;