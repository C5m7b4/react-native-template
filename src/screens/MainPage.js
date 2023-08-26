import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const MainPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Main Page 1</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    color: 'black',
    fontSize: 25,
  },
});

export default MainPage;
