import {
  TouchableOpacity,
  TextInput,
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Alert
} from 'react-native';
import { useState } from 'react';
import { getAuth, signInAnonymously } from 'firebase/auth';

const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [bgColor, setBGColor] = useState('#090C08');

  const bgColors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

  const auth = getAuth();

  /////////////// signInUser ///////////////
  // Navigate to Chat component after user signs in anonymously
  const signInUser = () => {
    signInAnonymously(auth)
      .then((result) => {
        navigation.navigate('Chat', {
          userID: result.user.uid,
          name: name,
          bgColor: bgColor
        });
      })
      .catch((error) => {
        Alert.alert('Unable to sign in, try later again.');
      });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/BackgroundImage.png')}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        {/*Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Chat</Text>
        </View>

        {/*Bottom Section Of Screen: TextInput, Background Options, Start Button*/}
        <View style={styles.contentContainer}>
          {/*TextInput*/}
          <View style={styles.section}>
            <TextInput
              style={styles.textInput}
              placeholder="Your Name"
              value={name}
              onChangeText={setName}
            ></TextInput>
          </View>

          {/*Background Options*/}
          <View style={styles.section}>
            <Text style={styles.chooseBackgroundText}>
              Choose backgroundColor:
            </Text>

            {/*colorColorContainer will render a circle around selected color */}
            {/*Button 1 */}
            <View style={styles.backgroundColorContainer}>
              <View
                style={[
                  styles.colorButtonContainer,
                  bgColor === bgColors[0]
                    ? { borderColor: 'gray' }
                    : { borderColor: 'white' }
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.backgroundButtonDefault,
                    { backgroundColor: bgColors[0] }
                  ]}
                  onPress={() => setBGColor(bgColors[0])}
                ></TouchableOpacity>
              </View>

              {/*Button 2 */}
              <View
                style={[
                  styles.colorButtonContainer,
                  bgColor === bgColors[1]
                    ? { borderColor: 'gray' }
                    : { borderColor: 'white' }
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.backgroundButtonDefault,
                    {
                      backgroundColor: bgColors[1]
                    }
                  ]}
                  onPress={() => setBGColor(bgColors[1])}
                ></TouchableOpacity>
              </View>

              {/*Button 3 */}
              <View
                style={[
                  styles.colorButtonContainer,
                  bgColor === bgColors[2]
                    ? { borderColor: 'gray' }
                    : { borderColor: 'white' }
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.backgroundButtonDefault,
                    { backgroundColor: bgColors[2] }
                  ]}
                  onPress={() => setBGColor(bgColors[2])}
                ></TouchableOpacity>
              </View>

              {/*Button 4 */}
              <View
                style={[
                  styles.colorButtonContainer,
                  bgColor === bgColors[3]
                    ? { borderColor: 'gray' }
                    : { borderColor: 'white' }
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.backgroundButtonDefault,
                    { backgroundColor: bgColors[3] }
                  ]}
                  onPress={() => setBGColor(bgColors[3])}
                ></TouchableOpacity>
              </View>
            </View>
          </View>

          {/*Start Button*/}
          <View style={styles.section}>
            <TouchableOpacity style={styles.customButton} onPress={signInUser}>
              <Text style={styles.customText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    height: '44%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '88%',
    minHeight: 300,
    marginBottom: 20
  },
  colorButtonContainer: {
    backgroundColor: 'white',
    height: 60,
    width: 60,
    borderRadius: 60 / 2,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  section: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 33,
    width: '100%'
  },
  titleContainer: {
    flex: 56,
    justifyContent: 'flex-start',
    borderColor: 'gray',
    paddingTop: 50
  },
  title: {
    fontSize: 48,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  customButton: {
    width: '88%',
    height: 50,
    marginBottom: 20,
    backgroundColor: '#757083',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textInput: {
    width: '88%',
    height: 50,
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 0.5
  },
  customText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  chooseBackgroundText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083'
  },
  backgroundButtonDefault: {
    borderRadius: 50 / 2,
    width: 50,
    height: 50
  },
  backgroundColorContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 20
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%'
  }
});

export default Start;
