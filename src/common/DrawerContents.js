import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';

const DrawerContents = props => {
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View>
          <View>
            <Text>Title</Text>
          </View>
          <View>
            <View>
              <Text>Menu item 1</Text>
            </View>
            <View>
              <Text>Menu item 2</Text>
            </View>
            <View>
              <Text>Menu item 3</Text>
            </View>
          </View>
        </View>
      </DrawerContentScrollView>
      <View>
        <Text>Footer</Text>
      </View>
    </View>
  );
};

export default DrawerContents;
