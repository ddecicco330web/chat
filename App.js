import Start from './components/Start';
import Chat from './components/Chat';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getFirestore,
  disableNetwork,
  enableNetwork
} from 'firebase/firestore';
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { Alert, LogBox } from 'react-native';
import { getStorage } from 'firebase/storage';

const Stack = createNativeStackNavigator();

export default function App() {
  LogBox.ignoreLogs(['@firebase/auth: Auth (10.3.1)']);
  const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert('Connection lost!');
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  const firebaseConfig = {
    apiKey: 'AIzaSyD6l8xctwjv6RJq4aExLeGADCpA3VTS3KA',
    authDomain: 'chatapp-65d6b.firebaseapp.com',
    projectId: 'chatapp-65d6b',
    storageBucket: 'chatapp-65d6b.appspot.com',
    messagingSenderId: '499599382524',
    appId: '1:499599382524:web:5d6f59bbcba6bebf53c479'
  };

  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);

  const storage = getStorage(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              isConnected={connectionStatus.isConnected}
              db={db}
              storage={storage}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
