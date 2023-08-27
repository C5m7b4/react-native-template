import React from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import {testData} from '../data';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const Charts = () => {
  return (
    <View style={styles.container}>
      <Text>Chart Examples</Text>
      <LineChart
        data={testData}
        width={SCREEN_WIDTH - 50}
        height={300}
        curve={false}
        tooltipVisible={true}
        onPressItem={(item: any) => console.log(item)}
        x_key={'month'}
        y_key={'value'}
      />
      <BarChart
        data={testData}
        width={SCREEN_WIDTH - 50}
        height={300}
        x_key={'month'}
        y_key={'value'}
        useBarGradient={true}
        animated={true}
        useBackgroundGradient={true}
        tooltipVisible={true}
        onPressItem={item => console.log(item)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Charts;
