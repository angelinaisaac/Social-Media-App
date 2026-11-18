import { useSQLiteContext } from 'expo-sqlite';
import React, { useState, useEffect ,useCallback} from 'react';
import { View, Text, TextInput,Image, Pressable, Alert, Modal,TouchableWithoutFeedback,SafeAreaView, FlatList } from 'react-native';
import * as FileSystem from 'expo-file-system';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { NavigationContainer , useFocusEffect} from '@react-navigation/native';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { Audio } from 'expo-av';
import styles from '../styles';

const DisplayAudio=({navigation, route})=>{
    const { user } = route.params;
    const db = useSQLiteContext();

    const [accName, setAccName] = useState('');
    const [accBio, setAccBio] = useState('');
    const [PFP, setPFP] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [posts, setPosts] = useState([]);
    const [sound, setSound] = useState(null);
    const defaultImg = require('../images/greypfp.jpg');



    const loadAccountInfo = async () => {
        try {
            const userRow = await db.getFirstAsync('SELECT id FROM userCreds WHERE username = ?', [user]);
        if (!userRow) return;

        const userId = userRow.id;
        const accountInfo = await db.getFirstAsync('SELECT * FROM accountInfo WHERE userCredsID = ?', [userId]);
        if(!accountInfo){
            await db.runAsync(`INSERT INTO accountInfo (name, bio, profilePic, userCredsID)VALUES(?,?,?,?)`,
                ['','',null,userId]);

            accountInfo = await db.getFirstAsync('SELECT * FROM accountInfo WHERE userCredsID = ?',
                [userId]
            );
        }
        if (accountInfo) {
            setAccName(accountInfo.name || '');
            setAccBio(accountInfo.bio || '');
            setPFP(accountInfo.profilePic || defaultImg);
        }
        } catch (error) {
        console.log("Error loading account info:", error);
        }
    };


    const loadPosts = async ()=>{
    try{
        const results = await db.getAllAsync(`SELECT 
        postAudio.id AS postId,
        postAudio.caption,
        postAudio.audio,
        postAudio.timestamp,
        userCreds.username,
        accountInfo.name,
        accountInfo.profilePic FROM postAudio
        JOIN accountInfo ON postAudio.accountInfoID = accountInfo.id
        JOIN userCreds ON accountInfo.userCredsID = userCreds.id
        ORDER BY postAudio.timestamp DESC
        `);
        //convert to base64 so posts can be played
        const postsWithUri = await Promise.all(
            results.map(async(post)=>{
                let audioUri =null;
                if(post.audio){
                    const fileUri = FileSystem.cacheDirectory + `postAudio_${post.postId}_${Date.now()}.m4a`;
                    await FileSystem.writeAsStringAsync(fileUri, post.audio,{
                        encoding:FileSystem.EncodingType.Base64,
                    });
                    const info = await FileSystem.getInfoAsync(fileUri);
                    if(info.exists){
                        audioUri = fileUri;
                    }else{
                        console.warn("Audio file not written", fileUri);
                    }
                }
                return{
                    ...post,
                    audioUri,
                };
            })
        );
        //setPosts(results);
        setPosts(postsWithUri);
    }catch(error){
        console.log("error loading posts: ",error);
    }
    };

    const playPostAudio= async(base64Audio)=>{
        try{
            //makes a temporary file in device cache
            const fileUri = FileSystem.cacheDirectory + 'tempAudio.mp3';
            //save base64 data to file
            await FileSystem.writeAsStringAsync(fileUri, base64Audio,{
                encoding: FileSystem.EncodingType.Base64,
            });
            
            //load and play sound
            const {sound} = await Audio.Sound.createAsync(
                {uri:fileUri},
                {shouldPlay:true}
            );
            return sound;
        }catch(error){
            Alert.alert("Error playing audio", error);
        }
    }

    async function playAudioFromURI(uri) {
    if (!uri) {
        Alert.alert("No audio to play!");
        return;
    }
    try {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS:false,
            playsInSilentModeIOS:true,
        });
        if(sound){
            await sound.unloadAsync();
            setSound(null);
        }
        const { sound: newSound } = await Audio.Sound.createAsync({ uri });
        setSound(newSound); 
        await newSound.playAsync();
        console.log("Playing from URI:", uri);
    } catch (error) {
        console.error("Error playing audio:", error);
        }
    }

    const deletePost= async (postID)=>{
        try{
            await db.runAsync(`DELETE FROM postAudio WHERE id = ?`,[postID]);
            setPosts(prev =>prev.filter(post=>post.Id!== postID));
            loadPosts();
          }catch(error){
            Alert.alert("Error deleting post", error);
          }
    }

    useEffect(() => {
        loadAccountInfo();
        loadPosts();
      }, []);
    
    useFocusEffect(
        useCallback(()=>{
            loadPosts();
        },[])
    );
    //<Pressable onPress = {()=>playPostAudio(item.audio)}>
    return(
        <View style = {styles.container}>
            <Modal
            animationType="fade"
            transparent={true}
            visible={menuVisible}
            onRequestClose={() => setMenuVisible(false)}>

                <TouchableWithoutFeedback onPress={()=>setMenuVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Upload Media</Text>

                        <Pressable style={styles.modalButton}onPress={() => {
                            setMenuVisible(false);
                            navigation.navigate("Photo",{user:user});
                                        
                        console.log('Open gallery');
                        }}>
                            <Text style={styles.modalButtonText}>Upload Photo</Text>
                        </Pressable>

                        <Pressable style={styles.modalButton} onPress={() => {
                            setMenuVisible(false);
                            navigation.navigate("Audio",{user:user});
                        }}>
                            <Text style={styles.modalButtonText}>Upload Audio</Text>
                        </Pressable>

                        <Pressable style={styles.modalButton} onPress={() => {
                            setMenuVisible(false);
                            navigation.navigate("Text",{user:user});
                        }}>
                            <Text style={styles.modalButtonText}>Upload Text</Text>
                        </Pressable>

                        <Pressable style={styles.modalCancel} onPress={() => setMenuVisible(false)}>
                            <Text style={styles.modalCancelText}>Cancel</Text>
                        </Pressable>
                        </View>
                    </View>
                </TouchableWithoutFeedback >
            </Modal>
            
        <SafeAreaView style ={{flex:1}}>
            <FlatList
            contentContainerStyle ={{ paddingTop:40}}
            data={posts}
            keyExtractor={(item) => item.postId.toString()}
            renderItem={({ item }) => (
                <View style={styles.postContainer}>
                    <View style={styles.postHeader}>
                        <Image 
                            source={typeof item.profilePic === 'string' ? { uri: item.profilePic } : defaultImg} 
                            style={styles.postPFP}
                        />
                    <View>
                        <Text style={styles.postUsername}>{item.username}</Text>
                        <Text style={styles.postName}>{item.name}</Text>
                    </View>
                    {item.username?.toLowerCase() === user?.toLowerCase() &&(
                        <Pressable onPress = {()=>deletePost(item.postId)}>
                            <EvilIcons name = "trash" size = {31} style ={{color:'red',paddingLeft:290,top:8}}/>
                        </Pressable>
                    )}
                    </View>
                        <Text style={styles.postAudioButtonText}>{item.caption}</Text>
                        <Pressable onPress = {()=>playAudioFromURI(item.audioUri)}>
                            <FontAwesome name = "play" size={25} style={{paddingLeft:10, bottom:15,color:"#63666A"}}/>
                        </Pressable>
                </View>
                )}
            />
    <View style = {styles.PFPHomeContainer}>
        <Pressable style = {styles.settingsIconCont} onPress={()=>setMenuVisible(true)}>
          <EvilIcons name = "plus" size={36} style = {styles.uploadIcon}/>
        </Pressable>
        <Pressable style = {styles.settingsIconCont} onPress={()=>navigation.navigate('Account',{accUser:user,ProfilePhoto:PFP})}>
          <EvilIcons name = "gear" size={36} style = {styles.settingsIcon}/>
        </Pressable>
        <Pressable onPress = {()=>navigation.navigate('Profile',{user:user})}>
            <Image style = {styles.PFPHome} source = {typeof PFP === 'string'? {uri:PFP}:defaultImg}/>
        </Pressable>
  </View>

        <View style = {styles.navBarCont}>
          <Pressable>
            <EvilIcons name = "image" size = {36} onPress={()=>navigation.navigate('Home',{user:user})}/>
          </Pressable>
          <Pressable>
            <EvilIcons name = "play" size = {36} style={{backgroundColor:'white', borderRadius:10, padding:3}}/>
          </Pressable>
          <Pressable>
            <EvilIcons name = "pencil" size = {36} onPress={()=>navigation.navigate('DisplayText',{user:user})}/>
          </Pressable>

        </View>

  </SafeAreaView>


  </View>
    );
};

export default DisplayAudio;