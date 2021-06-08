import React from 'react';
import {Button, SafeAreaView, View, StyleSheet} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Logger from '../logger/utilities/Log';

export default function Initial() {
  const onNextPress = () => {
    Actions.push('list');
    Logger.warning('Initial Screen - Next Press');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginVertical: 10}}>
        <Button title="Enter Application" onPress={onNextPress} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
});
