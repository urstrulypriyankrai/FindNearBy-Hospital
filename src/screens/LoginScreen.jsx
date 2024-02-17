import {Alert, Text, View, useColorScheme} from 'react-native';
import React, {useEffect, useState} from 'react';
import LoginButton from '../components/LoginButton';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
/********************End Of Imports***************/

const LoginScreen = ({navigation}) => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '1072388580641-i6fo2nchh3nujdmsqq61g1asafpbfdem.apps.googleusercontent.com',
    });
  }, []);
  const [userInfo, setUserInfo] = useState(null);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfoFromServer = await GoogleSignin.signIn();
      setUserInfo(userInfoFromServer);
      userInfoFromServer && navigation.navigate('Home');
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        Alert.alert('Unable to SignIn', 'Signin cancelled by user');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUserInfo(null);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <SafeAreaView style={backgroundStyle}>
      <View className="flex h-full justify-center items-center border  space-y-14 ">
        <View>
          <Text className="text-6xl text-center italic text-gray-600 font-semibold ">
            Find Hospital Nearby
          </Text>
        </View>
        <View>
          {userInfo == null ? (
            <LoginButton action={signIn} text={'Google Login'} />
          ) : (
            <LoginButton action={signOut} text={'LogOut'} />
          )}
        </View>
      </View>
      <View className="block bottom-20   ">
        <Text className="text-center tracking-widest text-gray-600">
          Login To Continue
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
