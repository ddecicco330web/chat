# chat

This is a mobile app built with React Native that lets you chat with others.

## Features

- Send messages in real time
- Customize background color
- Anonymous sign in
- View messages when offline
- Share photos from your library or photos taken from your phone camera
- Share your location
- Send audio recordings

## Technology Used

- React Native
- Expo
- Google Firebase
- AsyncStorage
- GiftedChat Library
- Expo ImagePicker, Audio, Location API

## Environment Setup

Create New Expo Project:
`npx create-expo-app chat --template`

Install Expo Globally:
`npm install - expo-cli`

Start Expo:
`npx expo start`

## Package Installs:

- @react-navigation/native
- @react-navigation/native-stack
- `npx expo install react-native-screens react-native-safe-area-context`
- react-native-gifted-chat
- firebase@10.3.1
- `npx expo install @react-native-async-storage/async-storage `
- `npx expo install @react-native-community/netinfo`
- 'npx expo install expo-image-picker'
- `npx expo install expo-location`
- `npx expo install react-native-maps`
- `npx expo install expo-av`

## Firebase

- Sign up or sign into firebase
- Install firebase
- Copy the Firebase Config into the App.js for your project
- To be able to read and write to your database, go to the rules tab inside your Firebase project change `allow read, write: if false;` to `allow read, write: if true;`
