import {StyleSheet, Dimensions} from 'react-native';
const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  svgWrapper: {
    backgroundColor: '#000',
    height: 300,
    width: width - 50,
  },
  svgStyle: {
    backgroundColor: '#000',
  },
});
export default styles;
