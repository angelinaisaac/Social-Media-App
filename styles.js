import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  LoginContainer:{
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    bottom:20,
  },
  title: {
    fontSize: 24,
    marginBottom:30,
    fontWeight: 'bold',
    textAlign:'center'
  },
  credInput: {
    width: '80%',
    padding:10,
    borderWidth: 1, 
    borderColor:'#ccc',
    marginVertical:5,
  },
  loginButton: {
    backgroundColor: 'blue',
    padding:10, 
    marginVertical: 10,
    width: '80%',
    borderRadius:5,
  },
  loginButtonText: {
    color:'white',
    textAlign:'center',
    fontSize:18,
  },
  signUpLink: {
    marginTop:10,
  },
  signUpLinkText: {
    color: 'blue',
  },
  changePFPCont:{
    alignItems:'center',
     justifyContent: 'center',
    position: 'relative',
    paddingBottom:30,
  },
  changePFP: {
    width:100,
    height:100,
    borderRadius:50,
  },
  modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)',
},
modalContent: {
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 20,
  width: '80%',
  alignItems: 'center',
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 20,
},
modalButton: {
  backgroundColor: 'blue',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 10,
  marginVertical: 5,
},
modalButtonText: {
  color: 'white',
  fontSize: 16,
},
modalCancel: {
  marginTop: 15,
},
modalCancelText: {
  color: '#888',
  fontSize: 16,
},

PFPHome:{
  borderRadius: 20,
  width:45,
  height:40,
  marginRight:4,
  paddingLeft:4
},


PFPHomeContainer:{
  top:50,
  alignSelf:'flex-end',
  flex:0.4,
  flexDirection:'row',
  marginTop:-3,
  position:'absolute',
  paddingTop:5,
  backgroundColor:'white',
  paddingLeft:300,

},

/*
settingsIcon:{
  
},
uploadIcon:{
},
*/

  modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)',
},
modalContent: {
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 20,
  width: '80%',
  alignItems: 'center',
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 20,
},
modalButton: {
  backgroundColor: 'blue',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 10,
  marginVertical: 5,
},
modalButtonText: {
  color: 'white',
  fontSize: 16,
},
modalCancel: {
  marginTop: 15,
},
modalCancelText: {
  color: '#888',
  fontSize: 16,
},
accountSettingsContainer:{
  alignItems:'center',
},
saveChangesAccountSettingsButton:{
  backgroundColor: "#2563EB",
  padding:10, 
  marginVertical: 10,
  width: '80%',
},
cameraIconCont:{
  position: 'absolute',
  bottom: 30,
  right:140,
  backgroundColor: 'white',
  borderRadius: 20,
  padding: 6,
  elevation: 3, 
  shadowColor: '#000', 
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 1 },
  shadowRadius: 2,
},

accountInfoTitleCont:{
  alignItems:'center',
  paddingTop:70,
  paddingBottom:25,
},

accountInfoTitle:{
  fontSize:24,
  fontWeight: '450',
  textAlign:'center',
},

settingsIconCont:{
  padding: 10,
  backgroundColor: 'transparent',
//  paddingBottom: 100,
},

logoutAccountSettingsButton:{
  marginVertical: 10,
  width: '80%',
  alignItems:'center'
},

deleteAccountSettingsButton:{
  textAlign:'center',
  fontSize:15,
  fontStyle:'italic',
  color:'blue',
  fontWeight:'light',
  color:'red'
},

logoutAccountSettingsText:{
  textAlign:'center',
  fontSize:15,
  fontStyle:'italic',
  color:'blue',
  fontWeight:'light'
},
navBarCont:{
  //top:300,
  padding:10,
  backgroundColor:'#d3d3d3',
  borderRadius:25,
  flexDirection:'row',
  alignItems:'center',
  width:200,
  bottom:25,
  right:105,
  outlineColor:'white',
  position:'absolute',
  justifyContent:'space-evenly'
},
postContainer: {
  marginVertical: 10,
  padding: 10,
  backgroundColor: '#fff',
  borderRadius: 10,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 5,
  //marginTop:20,
  //top:20,
//  elevation: 1.5,
},
postHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
},
postPFP: {
  width: 30,
  height: 30,
  borderRadius: 20,
  marginRight: 10,
},

postUsername: {
  fontWeight: 'bold',
},

postName: {
  color: '#666',
  fontSize: 12,
},

postImage: {
  width: '100%',
  height: 250,
  borderRadius: 10,
  marginTop: 10,
},

postCaption: {
  marginTop: 8,
  fontSize: 14,
},

backToHomeButton: {
  /*
  flexDirection: "row",          
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#2563EB",    
  paddingVertical: 7,
  paddingHorizontal: 10,
  borderRadius: 10,               
  marginTop: 20,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 4,
  overflow: "hidden",*/
  flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",   
    top:5,
    alignItems:'center',
    paddingVertical: 5.5,//9
    paddingHorizontal: 5,//8
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    marginTop: 20,
    overflow: "visible",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,

  },
  backToHomeButtonText:{
    color: "white",
    fontSize: 16,
    fontWeight: "550",
    marginLeft: 5,
  },
  backButtonCont:{
    flexDirection:'row',
  },

  backToHomeButtonPressed: {
    backgroundColor: "#1E40AF", 
  },
    arrowHead: {
    //position: "absolute",
    //right: -15,   
    //left:-19, 
    left:-7,//-11
    //bottom:0.5,               
    width: 16.5, //29
    height: 16.5,//29
    backgroundColor: "#2563EB",
    transform: [{ rotate: "45deg" }],
    
  },

  arrowHeadPressed: {
    backgroundColor: "#1E40AF", 
  },

  SettingsBackCont:{
    paddingTop:30,
    alignItems: "flex-start",
    paddingLeft:20,
  },
  postPhotoTitle:{
    fontSize: 24,
    fontWeight: "700",
    color: "black", 
    textAlign: "center",
    marginBottom: 20,
  },
  choosePhotoButton:{
    backgroundColor: "#3B82F6", 
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  choosePhotoButtonText:{
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  postPhotoButtonText:{
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  postPhotoInput:{
    borderWidth: 1,
    borderColor: "#D1D5DB", 
    backgroundColor: "#F3F4F6", 
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginVertical: 15,
  },
  postPhotoButton:{
    backgroundColor: "#2563EB", 
    paddingVertical: 14,
    alignItems:'center',
    borderRadius: 12,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  pfpProfileCont:{
    alignContent:'center',
  },

  profileText: {
    fontSize: 16,
    color: "#374151", 
    marginVertical: 2,
    marginVertical: 4,
    textAlign: "center",
  },

  profileCont:{
    flex: 1,
    padding: 20,
    alignItems: "center",
    paddingTop:100,
    justifyContent:"flex-start"
  },
  usernameText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
    bottom:10,
    paddingHorizontal: 30,
  },
  quotation:{
    fontSize:30,
    color:'black',
    fontWeight:'600',
  },
  bioCont:{
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 10,
  },
  audioContainer: {
    padding: 20,
    paddingTop:100,
    alignItems: "center",
   
    flex: 1,
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    minWidth: 200,
  },
  audioButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  postAudioInp:{
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginVertical: 15,
    width: "100%",
  },
  postAudioButton:{
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 30,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    minWidth: 200,
    alignItems: "center",
  },
  postAudioButtonText:{
    color: "black",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  commentCont:{
    justifyContent:'center',
    alignItems:'center',
    flex:1,
    paddingTop:15,
  },



});

export default styles;