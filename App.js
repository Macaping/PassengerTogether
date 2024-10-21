// 기본적인 React Native App.js 구조
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import AppNavigator from './navigation/AppNavigator';

const App = () => {

  return (
    <SafeAreaView style={styles.container}>
      <AppNavigator />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;