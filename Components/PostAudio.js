import { useSQLiteContext } from 'expo-sqlite';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NavigationContainer , useFocusEffect} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import styles from '../styles';

const PostAudio = ({ navigation, route }) => {
const { user } = route.params;
const db = useSQLiteContext();

const [recording, setRecording] = useState(null);
const [audioURI, setAudioURI] = useState(null);
const [sound, setSound] = useState(null);
const [caption, setCaption] = useState('');
const [accountInfoID, setAccountInfoID] = useState(null);

const [accName, setAccName] = useState('');
const [PFP, setPFP] = useState(null);

useEffect(() => {
    return sound
      ? () => {
          //cleanup on unmount
          sound.unloadAsync(); 
        }
      : undefined;
  }, [sound]);


//load in account information
const loadAccountInfo = async () => {
try {
    const userRow = await db.getFirstAsync(
        'SELECT id FROM userCreds WHERE username = ?',
        [user]
      );
      if (!userRow) return;

      const accountInfo = await db.getFirstAsync(
        'SELECT * FROM accountInfo WHERE userCredsID = ?',
        [userRow.id]
      );

      if (accountInfo) {
        setAccountInfoID(accountInfo.id);
      }
} catch (error) {
    console.log('Error loading account info:', error);
    }
  };

  async function startRecording() {
    try {
      //requests microphone permission 
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission to access microphone is required!');
        return;
      }
    
      //configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      //create new recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      //save recording to a state
      setRecording(recording);
      Alert.alert("recording");
    } catch (error) {
      console.error('Couldn’t start recording', error);
    }
  }

  async function stopRecording() {
    //dont do anything if audio isnt being recorded
    if (!recording) return;
    try {
      //stop recording and finalize audio file
      await recording.stopAndUnloadAsync();
      //convert recording to uri and save to state
      const uri = recording.getURI();
      setAudioURI(uri);
      //clear recording state so program knows recording has stopped
      setRecording(null);
      Alert.alert("stopped recording");
      //configure audio mode so playback will work
      await Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  playsInSilentModeIOS: true,
});
    } catch (error) {
      console.error('Couldn’t stop recording', error);
    }
  }

  async function addAudioToDB() {
    //ensures all required fields have input
    if (!audioURI || !caption) {
      Alert.alert('Please record audio and enter a caption.');
      return;
    }
    try {
      //convert uri to base64
      const base64Audio = await FileSystem.readAsStringAsync(audioURI, {
        encoding: FileSystem.EncodingType.Base64,
      });
      //inserts base64 audio and its caption into the table
      await db.runAsync(
        `INSERT INTO postAudio (caption, audio, accountInfoID) VALUES (?, ?, ?)`,
        [caption, base64Audio, accountInfoID]
      );
      navigation.navigate('Home',{user:user});
    } catch (error) {
      console.error("Couldn't add audio to DB", error);
    }
  }

  async function playAudioFromURI(uri) {
    //check if uri exists
    if (!uri) {
        Alert.alert("No audio to play!");
        return;
    }
    Alert.alert("Trying to play");
    //create new sound object from uri and save to state
    const { sound: newSound } = await Audio.Sound.createAsync({ uri });
   // setSound(sound);
    setSound(newSound);
    //play audio
    await newSound.playAsync();
    console.log("Playing from URI:", audioURI);
  }

  useEffect(() => {
    loadAccountInfo();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.audioContainer}>
      
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
        <Text style = {styles.title}>Post an Audio Recording</Text>
        <Pressable style={[styles.audioButton, styles.startButton]} onPress={startRecording}>
          <Text style={styles.postAudioButtonText}>Start Recording</Text>
          <FontAwesome name = "play" size={36} />
        </Pressable>
        <Pressable style={[styles.audioButton, styles.stopButton]} onPress={stopRecording}>
          <Text style={styles.postAudioButtonText}>Stop Recording</Text>
          <FontAwesome name = "stop" size={36} />
        </Pressable>
        <Pressable
        disabled={!!recording||!audioURI}
        style={[
        styles.audioButton,
        !!recording || !audioURI ? styles.previewButton : styles.previewButtonActive,
        ]}
        onPress={() => playAudioFromURI(audioURI)}>
          <Text style={styles.postAudioButtonText}>Preview</Text>
          <Feather name = "repeat" size={36} />
        </Pressable>
        <TextInput
          placeholder="Enter a caption..."
          style={styles.postAudioInp}
          value={caption}
          onChangeText={setCaption}
        />
        <Pressable style={styles.postAudioButton} onPress={addAudioToDB}>
          <Text style={styles.loginButtonText}>Post</Text>
        </Pressable>
    </View>
    </TouchableWithoutFeedback>
  );
};

export default PostAudio;
