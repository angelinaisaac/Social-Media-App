import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert,TouchableWithoutFeedback, Keyboard, Image,Modal} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import styles from '../styles'; 
import { WiHot } from 'react-icons/wi';


const AccountSettings = ({navigation, route})=>{
  const {accUser,ProfilePhoto} = route.params;
  const db = useSQLiteContext();

  const [accName, setAccName] = useState('');
  const [accBio, setAccBio] = useState('');

  const [menuVisible, setMenuVisible] = useState(false);
  const [PFP, setPFP] = useState(ProfilePhoto);

  const defaultImg = require("../images/greypfp.jpg");


 const loadAccountInfo = async () => {
  try {
    const userRow = await db.getFirstAsync('SELECT id FROM userCreds WHERE username = ?', [accUser]);
    if (!userRow) return;

    const userId = userRow.id;
    const accountInfo = await db.getFirstAsync('SELECT * FROM accountInfo WHERE userCredsID = ?', [userId]);
    if (accountInfo) {
      setAccName(accountInfo.name || '');
      setAccBio(accountInfo.bio || '');
      setPFP(accountInfo.profilePic || defaultImg);
    }
  } catch (error) {
    console.log("Error loading account info:", error);
  }
};

useEffect(() => {
  loadAccountInfo();
}, []);

  const uploadPFPImage = async (mode) =>{
    try{
      let result = {};

      if(mode === "gallery"){
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(perm !== "granted"){
          Alert.alert("You must grant photo gallery access for this action!");
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing:true,
          aspect:[1,1],
          quality:1,
        });

      }else{
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if(perm !== "granted"){
          Alert.alert("You must grant camera access for this action!");
          return;
        }
        result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing:true,
        aspect: [1,1],
        quality:1,
      });
      }
      if(!result.canceled){
        await saveImage(result.assets[0].uri);
      }
    }catch(error){
      Alert.alert("Error uploading photo");
      setMenuVisible(false);
    }
  };

  const saveImage = async (PFP) =>{
    try{
      const base64 = await FileSystem.readAsStringAsync(PFP, {
        encoding:FileSystem.EncodingType.Base64,
      });
      const PFPBlob = `data:image/jpeg;base64,${base64}`;
      setPFP(PFPBlob);
      //setPFP(PFP);
      setMenuVisible(false);
    }catch(error){
      throw error;
    }
  };

  const deleteAccount = async() =>{
    try{
      await db.runAsync(`DELETE FROM userCreds WHERE username = ?`,[accUser]);
      //Alert.alert("Account deleted!");
      navigation.navigate('Login');
    }catch(error){
      Alert.alert("Error deleting account", error);
    }
  };

  const handleAccountChange = async() =>{
  try{

    const userRow = await db.getFirstAsync('SELECT id FROM userCreds WHERE username = ?',[accUser]);
    if (!userRow) {
      Alert.alert('Error', 'User not found');
      return;
    }

    const userId = userRow.id;

    // Check if an accountInfo row already exists for this user
    const existingAccount = await db.getFirstAsync(
      'SELECT * FROM accountInfo WHERE userCredsID = ?',
      [userId]
    );

    if (existingAccount) {
      // Update if it exists
      await db.runAsync(
        'UPDATE accountInfo SET name = ?, bio = ?, profilePic =? WHERE userCredsID = ?',
        [accName, accBio,PFP, userId]
      );
    } else {
      // Insert if it doesn't
      await db.runAsync(
        'INSERT INTO accountInfo (name, bio, profilePic, userCredsID) VALUES (?, ?,?, ?)',
        [accName, accBio, PFP, userId]
      );
    }


    //await db.runAsync('INSERT INTO accountInfo (name, bio) VALUES (?,?)',[accName, accBio]);
    //Alert.alert('name changed');
    //navigation.navigate('Profile', {accountName:accName, accountBio: accBio, accUser:accUser, PFP:PFP});
    navigation.navigate('Profile', { user:accUser });
  }catch(error){

    console.log('Error during account mod : ', error);

    } 
  }
//      <Text style = {styles.loginButtonText}>Camera</Text>
//        <Image style = {styles.changePFP} source = {PFP?{uri:PFP}:require('../images/greypfp.jpg')}/>


/*<Pressable 
          style={({ pressed }) => [
            styles.backToHomeButton, 
            pressed && styles.backToHomeButtonPressed
          ]} 
          onPress={()=>navigation.navigate('Home',{user:accUser})}
        >
          
            <View style={styles.arrowHead} />
            <EvilIcons name = "arrow-left" size={25} style ={{color:'white',bottom:1,textAlign:'center',right:12}} />
            <Text style = {[styles.backToHomeButtonText,{right:13,textAlign:'center'}]}>Back to Home</Text>
            
          
      </Pressable>*/ 

  
  return(
  <View>
    <View style ={ styles.SettingsBackCont}>
      <Pressable 
          style={({ pressed }) => [
            styles.backToHomeButton, 
            pressed && styles.backToHomeButtonPressed && styles.arrowHeadPressed
            
          ]} 
          onPress={()=>navigation.navigate('Home',{user:accUser})}
        >
          
            <View style={styles.arrowHead} />
            <EvilIcons name = "arrow-left" size={25} style ={{color:'white',bottom:1,textAlign:'center',right:12}} />
            <Text style = {[styles.backToHomeButtonText,{right:13,textAlign:'center'}]}>Back to Home</Text>
            
          
      </Pressable>
    </View>
    <View style = {styles.accountInfoTitleCont}>    
        <Text style = {styles.accountInfoTitle}>Change Account Details</Text>
    </View>
    <View style = {styles.changePFPCont}>
        <Image style = {styles.changePFP} source = {typeof PFP === 'string'? {uri:PFP}:defaultImg}/>
        <Pressable style = {styles.cameraIconCont} onPress = {()=> setMenuVisible(true)} >
            <EvilIcons name = "camera" size={36} />
        </Pressable>
    </View>
      <Modal
    animationType="fade"
    transparent={true}
    visible={menuVisible}
    onRequestClose={() => setMenuVisible(false)}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Choose Photo Option</Text>

        <Pressable style={styles.modalButton} onPress={async() => {
          uploadPFPImage();
          //setMenuVisible(false);
          console.log('Open camera');
        }}>
          <Text style={styles.modalButtonText}>Take Photo</Text>
        </Pressable>

        <Pressable style={styles.modalButton} onPress={() => {
          uploadPFPImage("gallery");
         // setMenuVisible(false);
          console.log('Open gallery');
        }}>
          <Text style={styles.modalButtonText}>Choose From Gallery</Text>
        </Pressable>

        <Pressable style={styles.modalCancel} onPress={() => setMenuVisible(false)}>
          <Text style={styles.modalCancelText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
    <View style = {styles.accountSettingsContainer}>
        <TextInput
        style = {styles.credInput}
        placeholder={accUser}
        />
        <TextInput
            style = {styles.credInput}
            placeholder='Name'
            value={accName}
            onChangeText={setAccName}
        />
        <TextInput
            style = {styles.credInput}
            placeholder='Bio'
            value={accBio}
            onChangeText={setAccBio}
        />
        <Pressable style = {styles.saveChangesAccountSettingsButton} onPress = {handleAccountChange}>
        <Text style = {styles.loginButtonText}>Change Information</Text>
        </Pressable>
        <Pressable style = {styles.logoutAccountSettingsButton} onPress = {()=>navigation.navigate('Login')}>
                  <Text style = {styles.logoutAccountSettingsText}>Logout?</Text>
        </Pressable>
        <Pressable style = {styles.logoutAccountSettingsButton} onPress = {deleteAccount}>
                  <Text style = {styles.deleteAccountSettingsButton}>Delete Account?</Text>
        </Pressable>
    </View>
  </View>
  );
};
export default AccountSettings;