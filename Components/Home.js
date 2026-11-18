import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Pressable, Alert, Image,Button,FlatList,Modal, TouchableWithoutFeedback,SafeAreaView, Keyboard} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { NavigationContainer , useFocusEffect} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import styles from '../styles'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';


const HomeScreen = ({navigation, route}) =>{
  const {user} = route.params;
  const db = useSQLiteContext();

  const [accName, setAccName] = useState('');
  const [accBio, setAccBio] = useState('');
  const [PFP, setPFP] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  
  const defaultImg = require('../images/greypfp.jpg');
  




  const loadAccountInfo = async () => {
    try {
      const userRow = await db.getFirstAsync('SELECT id FROM userCreds WHERE username = ?', [user]);
      if (!userRow) return;

      const userId = userRow.id;
      const accountInfo = await db.getFirstAsync('SELECT * FROM accountInfo WHERE userCredsID = ?', [userId]);
      if (accountInfo) {
        setAccName(accountInfo.name || '');
        setAccBio(accountInfo.bio || '');
        //setPFP(accountInfo.profilePic || defaultImg);
        setPFP(accountInfo?.profilePic && typeof accountInfo.profilePic === "string"
          ? accountInfo.profilePic
          :null
        );
      }
    } catch (error) {
      console.log("Error loading account info:", error);
    }
};

const deletePost = async (postID)=>{
  try{
    await db.runAsync(`DELETE FROM postPhoto WHERE id = ?`,[postID]);
    setPosts(prev =>prev.filter(post=>post.Id!== postID));
    loadPosts();
  }catch(error){
    Alert.alert("Error deleting post", error);
  }
}

const loadPosts = async ()=>{
  try{
    const results = await db.getAllAsync(`SELECT 
      postPhoto.id AS postId,
      postPhoto.caption,
      postPhoto.photo,
      postPhoto.timestamp,
      userCreds.username,
      accountInfo.name,
      accountInfo.profilePic FROM postPhoto
      JOIN accountInfo ON postPhoto.accountInfoID = accountInfo.id
      JOIN userCreds ON accountInfo.userCredsID = userCreds.id
      ORDER BY postPhoto.timestamp DESC
      `);
      setPosts(results);
  }catch(error){
    console.log("error loading posts: ",error);
  }
};



useEffect(() => {
    loadAccountInfo();
    loadPosts();
  }, []);

  useFocusEffect(
    useCallback(()=>{
      loadPosts();
    },[])
  );

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
            
         // uploadPFPImage("gallery");
            
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
            console.log('Upload text');
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
            //source={typeof item.profilePic === 'string' ? { uri: item.profilePic } : defaultImg} 
            source = {item.profilePic
                        ?typeof item.profilePic === "string"
                          ?{uri: item.profilePic}
                          :defaultImg
                        :defaultImg
            }
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
        <Image 
          source={{ uri: item.photo }} 
          style={styles.postImage} 
        />
        <Text style={styles.postCaption}>{item.caption}</Text>
        
        
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
            <EvilIcons name = "image" size = {36} style={{backgroundColor:'white', borderRadius:10, padding:3}}/>
          </Pressable>
          <Pressable>
            <EvilIcons name = "play" size = {36} onPress={()=>navigation.navigate('DisplayAudio',{user:user})} />
          </Pressable>
          <Pressable>
            <EvilIcons name = "pencil" size = {36} onPress={()=>navigation.navigate('DisplayText',{user:user})}/>
          </Pressable>

        </View>

  </SafeAreaView>


  </View>
  );
};
export default HomeScreen;