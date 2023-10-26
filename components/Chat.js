import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Text,
  TouchableOpacity
} from 'react-native';
import { useEffect, useState } from 'react';
import {
  GiftedChat,
  Bubble,
  SystemMessage,
  Day,
  InputToolbar
} from 'react-native-gifted-chat';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';
import { Audio } from 'expo-av';

const Chat = ({ route, navigation, db, isConnected, storage }) => {
  const [messages, setMessages] = useState([]);

  const { name, bgColor, userID } = route.params;

  // use for when user plays audio
  let soundObject = null;

  let unSubMessages;

  useEffect(() => {
    navigation.setOptions({ title: name });

    if (isConnected === true) {
      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unSubMessages) unSubMessages();
      unSubMessages = null;

      // query Firebase collection to get user's list
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));

      // Add listener
      unSubMessages = onSnapshot(q, (documentsSnapshot) => {
        let newMessages = [];

        documentsSnapshot.forEach((doc) => {
          const date = new Date(doc.data().createdAt.toDate());
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: date
          });
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages();

    // Clean up
    return () => {
      if (unSubMessages) {
        unSubMessages();
      }

      if (soundObject) soundObject.unloadAsync();
    };
  }, [isConnected]);

  /////////////// loadCachedMessages ///////////////
  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem('messages')) || [];
    setMessages(JSON.parse(cachedMessages));
  };

  /////////////// cachedMessages ///////////////
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  /////////////// onSend ///////////////
  // add new messages to database and to message state array
  const onSend = (newMessages) => {
    const newMessageRef = addDoc(collection(db, 'messages'), newMessages[0]);

    if (newMessageRef) {
      setMessages([newMessages[0], ...messages]);
    } else {
      Alert.alert('Unable to send message.');
    }
  };

  /////////////// renderBubble ///////////////
  // style chat bubbles
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: { backgroundColor: '#00F' },
          left: { backgroundColor: '#0F0' }
        }}
      ></Bubble>
    );
  };

  /////////////// renderSystemMessage ///////////////
  // style text for system messages
  const renderSystemMessage = (props) => (
    <SystemMessage {...props} textStyle={styles.systemMsg} />
  );

  /////////////// renderDay ///////////////
  // style text for dates
  const renderDay = (props) => <Day {...props} textStyle={styles.dayText} />;

  /////////////// renderInputToolbar ///////////////
  // disable text input if user is offline
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  /////////////// renderCustomActions ///////////////
  // CustomActions will render a button that will display an array of options the user can do
  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} userID={userID} {...props} />;
  };

  /////////////// renderCustomView ///////////////
  // if someone shared their location, shop a MapView of that location
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={styles.map}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
      );
    }
    return null;
  };

  /////////////// renderAudioBubble ///////////////
  // show a button that will play the aduio clip when pressed
  const renderAudioBubble = (props) => {
    return (
      <View {...props}>
        <TouchableOpacity
          style={styles.audioButton}
          onPress={async () => {
            const { sound } = await Audio.Sound.createAsync({
              uri: props.currentMessage.audio
            });
            soundObject = sound;
            await sound.playAsync();
          }}
        >
          <Text style={styles.audioText}>Play Sound</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render Chat Messages
  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderSystemMessage={renderSystemMessage}
        renderDay={renderDay}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        renderMessageAudio={renderAudioBubble}
        onSend={(messages) => onSend(messages)}
        user={{ _id: userID, name: name }}
      ></GiftedChat>
      {Platform.OS === 'android' ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  audioButton: {
    backgroundColor: '#FF0',
    borderRadius: 10,
    margin: 5
  },
  audioText: {
    textAlign: 'center',
    color: 'black',
    padding: 5
  },
  map: { width: 150, height: 100, borderRadius: 13, margin: 3 },
  dayText: { color: 'white' },
  systemMsg: { color: 'white', fontSize: 16 }
});

export default Chat;
