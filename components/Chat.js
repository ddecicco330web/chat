import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Alert
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

const Chat = ({ route, navigation, db, isConnected, storage }) => {
  const [messages, setMessages] = useState([]);

  const { name, bgColor, userID } = route.params;

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
    };
  }, [isConnected]);

  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem('messages')) || [];
    setMessages(JSON.parse(cachedMessages));
  };

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  const onSend = (newMessages) => {
    const newMessageRef = addDoc(collection(db, 'messages'), newMessages[0]);

    if (newMessageRef) {
      setMessages([newMessages[0], ...messages]);
    } else {
      Alert.alert('Unable to send message.');
    }
  };

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

  const renderSystemMessage = (props) => (
    <SystemMessage {...props} textStyle={{ color: 'white', fontSize: 16 }} />
  );

  const renderDay = (props) => (
    <Day {...props} textStyle={{ color: 'white' }} />
  );

  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} userID={userID} {...props} />;
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
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
  }
});

export default Chat;
