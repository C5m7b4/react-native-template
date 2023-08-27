import {StyleSheet, Dimensions} from 'react-native';
const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  svgWrapper: {
    backgroundColor: 'transparent',
    height: 300,
    width: width - 50,
  },
  svgStyle: {
    backgroundColor: 'transparent',
  },
});
export default styles;
