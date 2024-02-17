import {ActivityIndicator, StyleSheet, View} from 'react-native';
import React from 'react';

const Spinner = () => {
  return (
    <View>
      <ActivityIndicator size="small" color="#0000ff" />
    </View>
  );
};

export default Spinner;

const styles = StyleSheet.create({});
