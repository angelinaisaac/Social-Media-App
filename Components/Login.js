

import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert,TouchableWithoutFeedback, Keyboard} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './Register';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles'; 


const LoginScreen = ({navigation}) =>{

  const db = useSQLiteContext();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
 

  const handleLogin = async() =>{
    //either password/login or both has not been inputted
    if(userName.length === 0 || password.length === 0){
      Alert.alert('Error', 'Please input both username and password...');
      return;
    }
    try{
      //checks if the given username exists
      const user = await db.getFirstAsync('SELECT * FROM userCreds WHERE username = ?',[userName]);
      if(!user){
        Alert.alert('Error','Username does not exist...');
        return;
      }
      //If credentials are valid navigate to home page
      const validUser = await db.getFirstAsync('SELECT * FROM userCreds WHERE username =? AND password =?',[userName,password]);
      if(validUser){
        //saves username as last used
        await AsyncStorage.setItem('lastUsername',userName);
        navigation.navigate('Home',{user:userName});
        setUserName('');
        setPassword('');
      }else{
        //password does not match
        Alert.alert('Error','Incorrect password..');
      }
    } catch(error){
        //catches any errors
      console.log('Error in login: ', error);
    }
  }


  //allows last logged in user to have username automatically displayed
  useEffect(()=>{
    const loadSavedUsername = async ()=>{
      try{
        const savedUsername = await AsyncStorage.getItem('lastUsername');
        if(savedUsername){
          setUserName(savedUsername);
        }
      }catch(error){
        console.log("error loading in last username",error);
      }
    };
    loadSavedUsername();
  },[]);
  //UI allows user to login by inputting username and password
  //Sign up button also displayed which will navigate user to the registration page
  return(
    <View style = {styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style = {styles.LoginContainer}>
              <Text style = {styles.title}>Login</Text>
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
              <Pressable style = {styles.loginButton} onPress = {handleLogin}>
                  <Text style = {styles.loginButtonText}>Login</Text>
              </Pressable>
              <Pressable style = {styles.signUpLink} onPress = {()=> navigation.navigate('Register')}>
                  <Text style = {styles.signUpLinkText}>Sign up</Text>
              </Pressable>
          </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default LoginScreen;
