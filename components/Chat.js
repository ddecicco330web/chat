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
  Day
} from 'react-native-gifted-chat';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc
} from 'firebase/firestore';

const Chat = ({ route, navigation, db }) => {
  const [messages, setMessages] = useState([]);

  const { name, bgColor, userID } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: name });

    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));

    const unSubMessages = onSnapshot(q, (documentsSnapshot) => {
      let newMessages = [];

      documentsSnapshot.forEach((doc) => {
        const date = new Date(doc.data().createdAt.toDate());
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: date
        });
      });
      setMessages(newMessages);
    });

    // Clean up
    return () => {
      if (unSubMessages) {
        unSubMessages();
      }
    };
  }, []);

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

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderSystemMessage={renderSystemMessage}
        renderDay={renderDay}
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
