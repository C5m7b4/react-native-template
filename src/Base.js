import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useSelector, useDispatch} from 'react-redux';
import DrawerContents from './common/DrawerContents';

import MainPage from './screens/MainPage';
import Charts from './screens/Charts';

const Drawer = createDrawerNavigator();

const Base = props => {
  const state = useSelector(app => app.loginReducer);
  const dispatch = useDispatch();

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRoute="/Main"
        backBehavior="history"
        drawerContent={props => <DrawerContents {...props} />}>
        <Drawer.Screen name="Main" component={MainPage} />
        <Drawer.Screen name="Charts" component={Charts} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default Base;
