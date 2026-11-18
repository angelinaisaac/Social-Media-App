import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Pressable, Alert, Image,Button,FlatList,Modal, TouchableWithoutFeedback,SafeAreaView, Keyboard} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { NavigationContainer , useFocusEffect} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import styles from '../styles'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const proto = async({}) =>{
return(
<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View >
        <Text >Register</Text>
        <TextInput
          
          placeholder='Username'
          
        />
        <TextInput
          
          placeholder='Password'
          
        />
        <TextInput
          
          placeholder='Confirm password'
         
        />
        <Pressable >
          <Text >Register</Text>
        </Pressable>
        <Pressable >
          <Text >Already have an account? Login here:</Text>
        </Pressable>
      </View>
      </TouchableWithoutFeedback>
);
};
export default proto;