# Social-Media-App
3rd year project, a social media app developed in React using Expo. Features include: account creation, authentication, view other's posts, profile customization, file, text and audio upload,  the ability to delete/edit your own posts, (with permission) access user camera roll, microphone, and camera, and the ability to update account details


#README

A React Native + Expo social media app centered around authenticity.
Users can create accounts, share posts (photo, audio, or text), and view content without the pressure of likes or followers. 


--
## Features
-User authentication(sign up or register)
-Post creation (photo, audio, text)
-Profile pages with user defined name, biography, and profile picture
-Profile pages with user specific decoration
-Settings with customizable account options
-intuitive navigation


** UNSOLVED BUG: when initially registering make sure you switch between the photo/audio/text display screens a couple times. 

Otherwise, the account will not be assigned a profile picture, and will be unable to post any content. Alternatively, choosing your own profile picture will solve this issue as well. 
**

--

# Install the core libraries:
npx expo install expo-sqlite
npx expo install expo-image-picker
expo install expo-file-system
npx expo install expo-haptics
npx expo install @react-native-async-storage/async-storage
npx expo install expo-av

# Install navigation libraries:
npm install @react-navigation/native
npm install @react-navigation/stack

# Other dependencies:
npm install regenerator-runtime

**Start the project using: npm start or npm expo start
Stop the project using ctrl + c**

--

# Installing libraries for unit testing: 
npm install --save-dev mocha chai @babel/core @babel/register metro-react-native-babel-preset

Test using: npm test
