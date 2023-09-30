import { View, StyleSheet } from 'react-native';
import { useEffect } from 'react';

const Chat = ({ route, navigation }) => {
  const { name, bgColor } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  return <View style={{ backgroundColor: bgColor, flex: 1 }}></View>;
};

export default Chat;
