import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Svg, {G, Path, Line, Circle} from 'react-native-svg';

const MainPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Main Page 1</Text>
      <Svg
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 500 500"
        xmlSpace="preserve"
        enableBackground="new 0 0 500 500"
        style={styles.svgStyle}>
        <G>
          <Circle className="st0" cx={179.2} cy={264.28} r={29.84} />
          <Circle className="st0" cx={289.76} cy={178.57} r={29.84} />
          <Circle className="st1" cx={349.38} cy={124.53} r={19.28} />
          <Circle className="st1" cx={368.66} cy={193.48} r={19.28} />
          <Circle className="st1" cx={225.81} cy={117.08} r={19.28} />
          <Path style={styles.st2} d="M241.07 128.86L269.91 159.91" />
          {/* <Path className="st2" d="M341.96 136.36L315.51 163.49" />
          <Path className="st2" d="M364.32 193.48L315.25 186.62" />
          <Circle className="st0" cx={351.78} cy={345.94} r={29.84} />
          <Circle className="st1" cx={369.22} cy={424.49} r={19.28} />
          <Circle className="st1" cx={299.77} cy={407.12} r={19.28} />
          <Circle className="st1" cx={436.86} cy={320.81} r={19.28} />
          <Path className="st2" d="M419.07 328.24L377.81 337.93" />
          <Path className="st2" d="M362.61 412.19L352.13 375.78" />
          <Path className="st2" d="M301.92 403.35L332.16 364.11" />
          <Circle className="st0" cx={125.81} cy={378.88} r={29.84} />
          <Circle className="st1" cx={66.19} cy={432.91} r={19.28} />
          <Circle className="st1" cx={46.9} cy={363.97} r={19.28} /> */}
          {/* <Circle className="st1" cx={189.76} cy={440.36} r={19.28} />
          <Path className="st2" d="M174.5 428.58L145.66 397.53" />
          <Path className="st2" d="M73.61 421.08L100.06 393.95" />
          <Path className="st2" d="M51.25 363.97L100.31 370.82" />
          <Path
            d="M179.2 264.28L289.76 178.57"
            fill="none"
            stroke="#000"
            strokeWidth={8}
            strokeMiterlimit={10}
          />
          <Path className="st4" d="M289.76 178.57L351.78 345.94" />
          <Path className="st4" d="M179.2 264.28L125.81 378.88" /> */}
        </G>
      </Svg>
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
  svgStyle: {
    backgroundColor: 'red',
    height: 300,
    width: 300,
  },
  st2: {
    stroke: '#000',
    strokeWidth: 2,
  },
});

export default MainPage;
