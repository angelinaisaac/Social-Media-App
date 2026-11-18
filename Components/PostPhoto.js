import { useSQLiteContext } from 'expo-sqlite';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import EvilIcons from 'react-native-vector-icons/EvilIcons'

import styles from '../styles';

const PostPhoto = ({ navigation, route }) => {
  const { user } = route.params;
  const db = useSQLiteContext();

  const [photo, setPhoto] = useState(null);
  const [caption, setCaption] = useState('');
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

  const saveImage = async (picUri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(picUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const photoBlob = `data:image/jpeg;base64,${base64}`;
      setPhoto(photoBlob);
    } catch (error) {
      console.log('Error saving image:', error);
    }
  };

  const uploadPhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if(permission !== "granted"){
        Alert.alert("We must have photo library permission to do this!");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        await saveImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error uploading photo');
    }
  };

  const handlePost = async () => {
    if (!photo || !caption) {
      Alert.alert('Please select a photo and write a caption.');
      return;
    }

    try {
      const result = await db.runAsync(
        'INSERT INTO postPhoto (caption, photo, accountInfoID) VALUES (?, ?, ?)',
        [caption, photo, accountInfoID]
      );


      
      navigation.navigate('Home',{user:user});
    } catch (error) {
      console.log('Error saving post:', error);
    }
  };

  /*await db.runAsync(
        `INSERT INTO userPosts (photoId, accountInfoID) VALUES (?,?)`,
        []
      ); */

  useEffect(() => {
    loadAccountInfo();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingTop:60}}>
      <View style ={ styles.SettingsBackCont}>
        <Pressable 
            style={({ pressed }) => [
              styles.backToHomeButton, 
             
              
            ]} 
            onPress={()=>navigation.navigate('Home',{user:user})}
          >
            
              <View style={styles.arrowHead} />
              <EvilIcons name = "arrow-left" size={25} style ={{color:'white',bottom:1,textAlign:'center',right:12}} />
              <Text style = {[styles.backToHomeButtonText,{right:13,textAlign:'center'}]}>Back to Home</Text>
              
            
        </Pressable>
      </View>
      <View style = {{paddingBottom:30}}>
       <Text style={styles.postPhotoTitle}>Create New Post</Text>
      </View>
      
      <Pressable onPress={uploadPhoto} style={styles.choosePhotoButton}>
        <Text style={styles.choosePhotoButtonText}>Choose Photo</Text>
      </Pressable>

      {photo && (
        <Image
          source={{ uri: photo }}
          style={{ width: 350, height: 300, alignSelf: 'center', marginVertical: 10, borderRadius:10 }}
        />
      )}

      <TextInput
        placeholder="Enter a caption..."
        style={styles.postPhotoInput}
        value={caption}
        onChangeText={setCaption}
      />

      <Pressable style={styles.postPhotoButton} onPress={handlePost}>
        <Text style={styles.postPhotoButtonText}>Post</Text>
      </Pressable>
    </ScrollView>
  );
};

export default PostPhoto;
