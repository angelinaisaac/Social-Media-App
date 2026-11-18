import { useSQLiteContext } from 'expo-sqlite';
import React, { useState, useEffect ,useCallback} from 'react';
import { View, Text, TextInput,Image, Pressable, Alert, Modal,TouchableWithoutFeedback,SafeAreaView, FlatList } from 'react-native';
import { NavigationContainer , useFocusEffect} from '@react-navigation/native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import styles from '../styles';

const DisplayText=({navigation, route})=>{
    const { user } = route.params;
    const db = useSQLiteContext();

    const [accName, setAccName] = useState('');
    const [accBio, setAccBio] = useState('');


    const [userID, setUserID] = useState();
    const [PFP, setPFP] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [posts, setPosts] = useState([]);

    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);


    const [commentsByPost, setCommentsByPost] = useState({});
    const [commentTextByPost,setCommentTextByPost] = useState({});

    const defaultImg = require('../images/greypfp.jpg');


    async function addComment(postId){
        const commentText = commentTextByPost[postId]||"";
        if(!commentText){
            Alert.alert("You cannot post an empty comment! Please add text...")
            return;
        }

        try{
            await db.runAsync(`INSERT INTO comment (content,accountInfoID, textID)VALUES(?,?,?)`,
                [commentText, userID, postId]
            );

            //clear input
            setCommentTextByPost(prev => ({...prev,[postId]:""}));
            loadComments(postId);

        }catch(error){
            Alert.alert("Could not add comment to database",error);
        }
    }

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
            setUserID(accountInfo.id);
            setAccName(accountInfo.name || '');
            setAccBio(accountInfo.bio || '');
            setPFP(accountInfo.profilePic || defaultImg);
        }
        } catch (error) {
        console.log("Error loading account info:", error);
        }
    };



    const loadComments = async (postId)=>{
        try{
            const results = await db.getAllAsync(`SELECT
                comment.id AS commentId,
                comment.content, 
                comment.timestamp,
                userCreds.username,
                accountInfo.name,
                accountInfo.profilePic FROM comment
                JOIN accountInfo ON comment.accountInfoID = accountInfo.id
                JOIN userCreds ON accountInfo.userCredsID = userCreds.id
                WHERE comment.textID =?
                ORDER BY comment.timestamp DESC
                `,[postId]);
            setCommentsByPost(prev=>({...prev,[postId]:results}));
        }catch(error){
            console.log("Could not fetch comments from database", error)
        }
    }

    const loadPosts = async ()=>{
    try{
        const results = await db.getAllAsync(`SELECT 
        postText.id AS postId,
        postText.title,
        postText.content,
        postText.timestamp,
        userCreds.username,
        accountInfo.name,
        accountInfo.profilePic FROM postText
        JOIN accountInfo ON postText.accountInfoID = accountInfo.id
        JOIN userCreds ON accountInfo.userCredsID = userCreds.id
        ORDER BY postText.timestamp DESC
        `);
        setPosts(results);
    }catch(error){
        console.log("error loading posts: ",error);
    }
    };

   

    const deletePost= async (postID)=>{
        try{
            await db.runAsync(`DELETE FROM postText WHERE id = ?`,[postID]);
            setPosts(prev =>prev.filter(post=>post.Id!== postID));
            loadPosts();
        }catch(error){
            Alert.alert("Error deleting post", error);
        }
    }

    const deleteComment = async(commentId, postId)=>{
        try{
            await db.runAsync(`DELETE FROM comment WHERE id = ?`,[commentId]);
            loadComments(postId);
        }catch(error){
            Alert.alert("Could not delete comment",error);
        }
    }

    useEffect(() => {
        loadAccountInfo();
        loadComments()
        loadPosts();
      }, []);
    
    useFocusEffect(
        useCallback(()=>{
            loadComments();
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
                            <EvilIcons name = "trash" size = {31} style ={{color:'red',paddingLeft:275,top:8}}/>
                            
                        </Pressable>
                    )}
                    </View>
                    <Text style={styles.postCaption}>{item.title}</Text>
                    <Text style = {styles.postCaption}>{item.content}</Text> 
                    <Pressable onPress={()=>{
                        setShowComments(prev => ({...prev, [item.postId]:!prev[item.postId]}));
                        if(!showComments[item.postId])loadComments(item.postId);
                    }}>
                            <EvilIcons 
                            name ={showComments[item.postId]?"chevron-down":"chevron-up"}
                            size = {31} style ={{paddingLeft:350,top:-10}}/>
                        </Pressable>

                        {showComments[item.postId] &&(
                            <View style ={{flex:1}}>
                                <FlatList
                                    //contentContainerStyle ={{ paddingTop:40}}
                                    data={commentsByPost[item.postId]||[]}
                                    keyExtractor={c => c.commentId.toString()}
                                    renderItem={({ item:comment }) => (
                                        <View style={styles.postContainer}>
                                            <View style={styles.postHeader}>
                                                <Image 
                                                    source={typeof comment.profilePic === 'string' ? { uri: comment.profilePic } : defaultImg} 
                                                    style={styles.postPFP}
                                                />
                                            <View>
                                                <Text style={styles.postUsername}>{comment.username}</Text>
                                                <Text style={styles.postName}>{comment.name}</Text>
                                            </View>
                                            {comment.username?.toLowerCase() === user?.toLowerCase() &&(
                                                <Pressable onPress = {()=>deleteComment(comment.commentId, item.postId)}>
                                                    <EvilIcons name = "trash" size = {25} style ={{color:'red',paddingLeft:275,top:0}}/>
                                                </Pressable>
                                            )}
                                            </View>
                                            <Text style = {styles.postCaption}>{comment.content}</Text> 
                                        </View>
                                        )}
                                    />
                                    <View style = {styles.commentCont}>

                                        <TextInput
                                            placeholder="Enter comment..."
                                            style={[styles.credInput,{width:350, borderRadius:15}]}
                                            value={commentTextByPost[item.postId||""]}
                                            onChangeText={text => setCommentTextByPost(prev => ({...prev,[item.postId]:text}))}
                                        />
                                    <Pressable style={[styles.saveChangesAccountSettingsButton,{width:350,borderRadius:15}]} onPress={()=>addComment(item.postId)}>
                                        <Text style={styles.loginButtonText}>Post</Text>
                                    </Pressable>
                                </View>
                            </View>
                        )}
                    
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
            <EvilIcons name = "play" size = {36} onPress={()=>navigation.navigate('DisplayAudio',{user:user})} />
          </Pressable>
          <Pressable>
            <EvilIcons name = "pencil" size = {36}style={{backgroundColor:'white', borderRadius:10, padding:3}}/>
          </Pressable>

        </View>

  </SafeAreaView>


  </View>
    );
};

export default DisplayText;