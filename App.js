import Start from './components/Start';
import Chat from './components/Chat';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const Stack = createNativeStackNavigator();

export default function App() {
  const firebaseConfig = {
    apiKey: 'AIzaSyD6l8xctwjv6RJq4aExLeGADCpA3VTS3KA',
    authDomain: 'chatapp-65d6b.firebaseapp.com',
    projectId: 'chatapp-65d6b',
    storageBucket: 'chatapp-65d6b.appspot.com',
    messagingSenderId: '499599382524',
    appId: '1:499599382524:web:5d6f59bbcba6bebf53c479'
  };

  const app = initializeApp(firebaseConfig);

  initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });

  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
