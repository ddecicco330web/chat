import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { useEffect, useState } from 'react';
import {
  GiftedChat,
  Bubble,
  SystemMessage,
  Day
} from 'react-native-gifted-chat';

const Chat = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);

  const { name, bgColor } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: name });

    {
      /*Send system message saying user has entered. */
    }
    setMessages([
      {
        _id: 1,
        text: 'Hello',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any'
        }
      },
      {
        _id: 2,
        text: `${name} entered the chat.`,
        createdAt: new Date(),
        system: true
      }
    ]);
  }, []);

  const onSend = (newMessages) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
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
        user={{ _id: 1, name }}
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
