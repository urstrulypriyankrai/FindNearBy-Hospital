import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

const LoginButton = () => (
  <TouchableOpacity>
    <Text className="text-green-600 border-green-600 border-b p-2 px-6 rounded-md animate-bounce ">
      Google Login
    </Text>
  </TouchableOpacity>
);

export default LoginButton;
