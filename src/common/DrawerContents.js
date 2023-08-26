import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faSitemap} from '@fortawesome/free-solid-svg-icons/faSitemap';

const DrawerContents = props => {
  const handleNavigation = record => {
    props.navigation.navigate(record);
  };
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View>
          <View style={styles.title}>
            <FontAwesomeIcon
              icon={faSitemap}
              size={24}
              color="black"
              style={{marginTop: 10}}
            />
            <Text style={styles.titleText}>Device Menu</Text>
          </View>
          <View style={{marginTop: 10}}>
            <Pressable
              style={styles.menuItem}
              onPress={() => handleNavigation('Main')}>
              <Text style={styles.menuText}>Home</Text>
            </Pressable>
            <Pressable
              style={styles.menuItem}
              onPress={() => handleNavigation('Charts')}>
              <Text style={styles.menuText}>Charts</Text>
            </Pressable>
          </View>
        </View>
      </DrawerContentScrollView>
      <View>
        <Text>Footer</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    flexDirection: 'row',
    marginLeft: 10,
    borderBottomWidth: 4,
    borderBottomColor: 'black',
    marginBottom: 10,
    paddingBottom: 5,
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  menuItem: {
    height: 50,
    marginBottom: 5,
    paddingLeft: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  menuText: {
    fontSize: 21,
    fontWeight: 'bold',
  },
});

export default DrawerContents;
