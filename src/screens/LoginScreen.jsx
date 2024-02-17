import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import React, {useEffect} from 'react';
import LoginButton from '../components/LoginButton';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const LoginScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
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
          <LoginButton />
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

const styles = StyleSheet.create({});
