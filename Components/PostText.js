import { useSQLiteContext } from 'expo-sqlite';
import React, { useState, useEffect } from 'react';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { View, Text, TextInput, Pressable, Alert, Image, ScrollView } from 'react-native';
import styles from '../styles';

const PostText = ({ navigation, route }) => {
  const { user } = route.params;
  const db = useSQLiteContext();



  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  const [accountInfoID, setAccountInfoID] = useState(null);

  const [accName, setAccName] = useState('');
  const [accBio, setAccBio] = useState('');
  const [PFP, setPFP] = useState(null);

  const defaultImg = require('../images/greypfp.jpg');

  const loadAccountInfo = async () => {
    try {
      const userRow = await db.getFirstAsync(
        'SELECT id FROM userCreds WHERE username = ?',
        [user]
      );
      if (!userRow) return;

      const userId = userRow.id;
      const accountInfo = await db.getFirstAsync(
        'SELECT * FROM accountInfo WHERE userCredsID = ?',
        [userId]
      );

      //if no account info create one with defaults
      if(!accountInfo){
        await db.runAsync(`INSERT INTO accountInfo (name, bio, profilePic, userCredsID)VALUES(?,?,?,?)`,
          ['','',null,userId]
        );
        accountInfo = await db.getFirstAsync(
        'SELECT * FROM accountInfo WHERE userCredsID = ?',
        [userId]
      );
      }

      

      if (accountInfo) {
        setAccountInfoID(accountInfo.id);
        setAccName(accountInfo.name || '');
        setAccBio(accountInfo.bio || '');
        setPFP(accountInfo.profilePic || defaultImg);
      }
    } catch (error) {
      console.log('Error loading account info:', error);
    }
  };

  const handlePost = async () => {
    if (!content || !title) {
      Alert.alert('Please add both content and a title!');
      return;
    }

    try {
      await db.runAsync(
        'INSERT INTO postText (title, content, accountInfoID) VALUES (?, ?, ?)',
        [title, content, accountInfoID]
      );
     // navigation.goBack();
     navigation.navigate('DisplayText',{user:user});
    } catch (error) {
      console.log('Error saving post:', error);
    }
  };

  useEffect(() => {
    loadAccountInfo();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ paddingTop:150, padding:20, }}>

      <View style ={ styles.SettingsBackCont}>
      <Pressable 
          style={({ pressed }) => [
            styles.backToHomeButton, 
            pressed && styles.backToHomeButtonPressed && styles.arrowHeadPressed
            
          ]} 
          onPress={()=>navigation.navigate('Home',{user:user})}
        >
          
            <View style={styles.arrowHead} />
            <EvilIcons name = "arrow-left" size={25} style ={{color:'white',bottom:1,textAlign:'center',right:12}} />
            <Text style = {[styles.backToHomeButtonText,{right:13,textAlign:'center'}]}>Back to Home</Text>
            
          
      </Pressable>
    </View>
      <Text style={styles.title}>Create New Post</Text>


      <TextInput
        placeholder="Enter a title..."
        style={styles.postPhotoInput}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Enter content..."
        style={styles.postPhotoInput}
        value={content}
        onChangeText={setContent}
      />

      <Pressable style={styles.postPhotoButton} onPress={handlePost}>
        <Text style={styles.postPhotoButtonText}>Post</Text>
      </Pressable>
    </ScrollView>
  );
};

export default PostText;
