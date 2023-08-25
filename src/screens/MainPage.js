import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const MainPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Main Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  text: {
    color: 'white',
    fontSize: 25,
  },
});

export default MainPage;
