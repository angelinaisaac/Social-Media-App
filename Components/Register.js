
import { useSQLiteContext } from 'expo-sqlite';
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert,TouchableWithoutFeedback, Keyboard} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import styles from '../styles'; 


const RegisterScreen = ({navigation}) =>{

  const db = useSQLiteContext();

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const handleRegister = async() =>{
    //returns alert if any input fields are empty
    if(userName.length === 0 || password.length === 0 || confirmPassword.length===0){
      Alert.alert('Error','Please enter all fields...');
      return;
    }
    //if the password field is not equal to the confirm password field alert the user
    if(password != confirmPassword){
      Alert.alert('Error','Passwords do not match...');
      return;
    }
    try{
      //checks if username is taken or not
      const existingUser = await db.getFirstAsync('SELECT * FROM userCreds WHERE username = ?',[userName]);
      if(existingUser){
        Alert.alert('Error','Username already exists');
        return;
      }
      //create account by inserting username and password into the darabase
      await db.runAsync('INSERT INTO userCreds (username, password) VALUES (?,?)',[userName,password]);
      Alert.alert('Success','Registration complete')
      setDefaultPFP(null, null, null, userName);
      navigation.navigate('Home', {user:userName});
    } catch(error){
      console.log('Error during registration : ', error);
    }
  }
  async function setDefaultPFP(name, bio, userCredsID, PFPPath){
    let PFPData =null;
    if(PFPPath){
      PFPData = await FileSystem.readAsStringAsync(PFPPath,{encoding:FileSystem.EncodingType.Base64});
    }
    else{
      const defaultPath = FileSystem.documentDirectory + 'greypfp.jpg';
      const asset = require('../images/greypfp.jpg');
      const defaultUri = asset.fromModule(asset).uri;
      PFPData = await FileSystem.readAsStringAsync(defaultUri,{encoding:FileSystem.EncodingType.Base64});
    }
    await db.runAsync(`INSERT INTO accountInfo (name, bio, profilePic, userCredsID) VALUES(?,?,?,?)`,
      [name, bio, PFPData, userCredsID]
    );
  }

    //input fields allow user to select username and password
    //The register button creates the account
    //Once the account is created the user is directed to the home page
    //A pressable element allows the user to navigate back to the login page if needed
    return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style = {styles.LoginContainer}>
        <Text style = {styles.title}>Register</Text>
        <TextInput
          style = {styles.credInput}
          placeholder='Username'
          value={userName}
          onChangeText={setUserName}
        />
        <TextInput
          style = {styles.credInput}
          placeholder='Password'
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style = {styles.credInput}
          placeholder='Confirm password'
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Pressable style = {styles.loginButton} onPress = {handleRegister}>
          <Text style = {styles.loginButtonText}>Register</Text>
        </Pressable>
        <Pressable style = {styles.signUpLink} onPress = {()=> navigation.navigate('Login')}>
          <Text style = {styles.signUpLinkText}>Already have an account? Login</Text>
        </Pressable>
      </View>
      </TouchableWithoutFeedback>
    );
};


export default RegisterScreen;