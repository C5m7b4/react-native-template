import React, {useState, useEffect} from 'react';
import {View, Animated, Easing, Dimensions} from 'react-native';
import styles from './styles';
import {quickSort} from '../../../helpers';
import Svg, {
  G,
  Line,
  Circle,
  Rect,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);

const {width: cWidth} = Dimensions.get('window');

const BarChart = ({
  data = [],
  x_key = 'month',
  y_key = 'value',
  onPressItem,
  height: containerHeight = 300,
  width: containerWidth = cWidth,
  axis_circle_radius = 5,
  axis_circle_stroke = 2,
  axis_circle_fill = '#fff',
  axis_circle_opacity = 1,
  axisLineStrokeWidth = 2,
  axisLineStrokeOpacity = 1,
  axisLineColor = '#fff',
  useMinYValue = false,
  barWidth = 22,
  barColor = '#99469c',
  barOpacity = 0.4,
  useBarGradient = false,
  animated = false,
  useBackgroundGradient = false,
  x_axis_label_config = {
    rotation: 0,
    fontSize: 12,
    fontColor: '#fff',
    textAnchor: 'middle',
    fontWeight: '400',
  },
  y_axis_label_config = {
    rotation: 0,
    fontSize: 15,
    fontColor: '#fff',
    textAnchor: 'end',
    fontWeight: '400',
  },
  background_gradient_config = {
    gradientUnits: 'userSpaceOnUse',
    x1: 0,
    y1: 0,
    x2: 0,
    y2: containerHeight,
    stop1: {
      offset: 0,
      stopColor: '#46ace8',
      stopOpacity: 1,
    },
    stop2: {
      offset: 0.5,
      stopColor: '#3f83ab',
      stopOpacity: 1,
    },
    stop3: {
      offset: 0.75,
      stopColor: '#2a6182',
      stopOpacity: 1,
    },
    stop4: {
      offset: 1,
      stopColor: '#17374a',
      stopOpacity: 1,
    },
  },
  tooltipVisible = false,
  tooltip_config = {
    tooltipFill: '#fff',
    tooltipBorderRadius: 7,
    fontSize: 12,
    fontWeight: '400',
    textAnchor: 'middle',
  },
}) => {
  const [yAxisLabels, setYAxisLabels] = useState([]);
  const x_margin = 50;
  const y_margin = 50;
  // const padding_from_screenBorder = 20;

  useEffect(() => {
    const yKeys = data.map(item => item[y_key]);
    const yAxisData = quickSort(yKeys);
    setYAxisLabels(yAxisData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const calculateWidth = () => {
    const chartWidth = containerWidth - x_margin * 2;
    const gap_between_ticks = chartWidth / (data.length + 1);
    return {
      chartWidth,
      gap_between_ticks,
    };
  };

  const calculateHeight = () => {
    const yMax = data.reduce((acc, cur) => {
      return cur[y_key] > acc ? cur[y_key] : acc;
    }, 0);
    const yMin = data.reduce((acc, cur) => {
      return cur[y_key] < acc ? cur[y_key] : acc;
    }, yMax);
    let min = useMinYValue ? yMin : 0;
    const actual_chart_height = containerHeight - y_margin * 2;
    let gap_between_ticks = actual_chart_height / (data.length - 1);
    const y_value_gap = (yMax - min) / (data.length - 1);
    return {yMax, yMin, min, gap_between_ticks, y_value_gap};
  };

  const render_background = () => {
    return (
      <Rect
        x={0}
        y={0}
        width={containerWidth}
        height={containerHeight}
        fill={'url(#gradientback)'}
        rx={20}
      />
    );
  };

  const render_x_axis = () => {
    return (
      <G key="x_axis">
        <Circle
          cx={x_margin}
          cy={containerHeight - y_margin}
          fill={axis_circle_fill}
          stroke={axis_circle_stroke}
          r={axis_circle_radius}
          opacity={axis_circle_opacity}
        />
        <Circle
          cx={containerWidth - x_margin}
          cy={containerHeight - y_margin}
          fill={axis_circle_fill}
          stroke={axis_circle_stroke}
          r={axis_circle_radius}
          opacity={axis_circle_opacity}
        />
        <Line
          x1={x_margin}
          y1={containerHeight - y_margin}
          x2={containerWidth - x_margin}
          y2={containerHeight - y_margin}
          stroke={axisLineColor}
          strokeWidth={axisLineStrokeWidth}
        />
      </G>
    );
  };

  const render_y_axis = () => {
    return (
      <G key={'y_axis'}>
        <Circle
          cx={x_margin}
          cy={y_margin}
          fill={axis_circle_fill}
          stroke={axis_circle_stroke}
          r={axis_circle_radius}
          opacity={axis_circle_opacity}
        />
        <Line
          x1={x_margin}
          y1={containerHeight - y_margin}
          x2={x_margin}
          y2={y_margin}
          stroke={axisLineColor}
          strokeWidth={axisLineStrokeWidth}
        />
      </G>
    );
  };

  const render_x_axis_ticks = () => {
    const {gap_between_ticks} = calculateWidth();
    return data.map((item, index) => {
      const x = x_margin * 2 + gap_between_ticks * index;
      const y = containerHeight - y_margin;
      return (
        <G key={`x-axis_ticks_${index}`}>
          <Line
            x1={x}
            y1={y}
            x2={x}
            y2={y + 10}
            stroke={axisLineColor}
            strokeWidth={axisLineStrokeWidth}
            opacity={axisLineStrokeOpacity}
          />
        </G>
      );
    });
  };

  const render_x_axis_labels = () => {
    return data.map((item, index) => {
      const {gap_between_ticks} = calculateWidth();
      const {rotation, fontSize, fontColor, textAnchor, fontWeight} =
        x_axis_label_config;
      const x = x_margin * 2 + gap_between_ticks * index;
      const y = containerHeight - y_margin + 10 + fontSize;

      return (
        <SvgText
          key={`x-axis-label-${index}`}
          x={x}
          y={y}
          rotation={rotation}
          origin={`${x}, ${y}`}
          textAnchor={textAnchor}
          fontWeight={fontWeight}
          fontSize={fontSize}
          fill={fontColor}>
          {item[x_key]}
        </SvgText>
      );
    });
  };

  const render_y_axis_ticks = () => {
    const {gap_between_ticks} = calculateHeight();
    return data.map((item, index) => {
      const y = containerHeight - y_margin - gap_between_ticks * index;
      return (
        <G key={`y_axis_ticks_${index}`}>
          <Line
            x1={x_margin}
            y1={y}
            x2={x_margin - 10}
            y2={y}
            stroke={axisLineColor}
            strokeWidth={axisLineStrokeWidth}
            opacity={axisLineStrokeOpacity}
          />
        </G>
      );
    });
  };

  const render_y_axis_labels = () => {
    const {gap_between_ticks, min, yMax} = calculateHeight();
    const {rotation, fontSize, fontWeight, fontColor, textAnchor} =
      y_axis_label_config;
    const x = x_margin - 10;
    return yAxisLabels.map((item, index) => {
      const y = containerHeight - y_margin - gap_between_ticks * index;
      const dataPoints = data.length - 1;
      const textValue = min + (yMax / dataPoints) * index;
      return (
        <G key={`y_axis_labels_${index}`}>
          <SvgText
            key={'x-axis-label'}
            x={x}
            y={y + fontSize / 3}
            rotation={rotation}
            origin={`${x}, ${y}`}
            textAnchor={textAnchor}
            fontWeight={fontWeight}
            fontSize={fontSize}
            fill={fontColor}>
            {textValue}
          </SvgText>
        </G>
      );
    });
  };

  const render_barchart = () => {
    const {gap_between_ticks: y_gap, yMax, y_value_gap} = calculateHeight();
    const {gap_between_ticks: x_gap} = calculateWidth();
    const y = containerHeight - y_margin;

    return data.map((item, index) => {
      const x = x_margin * 2 + x_gap * index;
      const height = (yMax - item[y_key]) * (y_gap / y_value_gap) + y_margin;
      const barHeight = containerHeight - y_margin - height;

      let animatedHeight = new Animated.Value(0);
      Animated.timing(animatedHeight, {
        toValue: -barHeight,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();

      if (useBarGradient) {
        return (
          <G key={`bars_${index}`}>
            <AnimatedRect
              x={x - barWidth / 2}
              y={y}
              height={animated ? animatedHeight : -barHeight}
              width={barWidth}
              fill={'url(#barGradient)'}
              opacity={barOpacity}
              onPress={() => onPressItem(item)}
            />
          </G>
        );
      } else {
        return (
          <G key={`bars_${index}`}>
            <AnimatedRect
              x={x - barWidth / 2}
              y={y}
              height={animated ? animatedHeight : -barHeight}
              width={barWidth}
              fill={barColor}
              opacity={barOpacity}
              onPress={() => onPressItem(item)}
            />
          </G>
        );
      }
    });
  };

  const render_tooltips = () => {
    const {gap_between_ticks: y_gap, yMax, y_value_gap} = calculateHeight();
    const {gap_between_ticks: x_gap} = calculateWidth();
    const animatedOpacity = new Animated.Value(0);
    Animated.timing(animatedOpacity, {
      toValue: 1,
      delay: 500,
      duration: 500,
      useNativeDriver: true,
    }).start();
    return data.map((item, index) => {
      const x = x_margin * 2 + x_gap * index;
      const y = (yMax - item[y_key]) * (y_gap / y_value_gap) + y_margin;
      return (
        <G key={`tooltips_${index}`}>
          <AnimatedSvgText
            x={x}
            y={y - 5}
            textAnchor={tooltip_config.textAnchor}
            fontWeight={tooltip_config.fontWeight}
            fontSize={tooltip_config.fontSize}
            fill={tooltip_config.tooltipFill}
            opacity={animatedOpacity}>
            {item[y_key]}
          </AnimatedSvgText>
        </G>
      );
    });
  };

  return (
    <View
      style={[
        styles.svgWrapper,
        {height: containerHeight, width: containerWidth},
      ]}>
      <Svg height="100%" width="100%" style={styles.svgStyle}>
        <Defs>
          <LinearGradient
            id="barGradient"
            gradientUnits={'userSpaceOnUse'}
            x1={0}
            y1={0}
            x2={0}
            y2={containerHeight}>
            <Stop offset={0} stopColor={'red'} stopOpacity={1} />
            <Stop offset={1} stopColor={'blue'} stopOpacity={1} />
          </LinearGradient>
          {useBackgroundGradient ? (
            <LinearGradient
              id="gradientback"
              gradientUnits={background_gradient_config.gradientUnits}
              x1={background_gradient_config.x1}
              y1={background_gradient_config.y1}
              x2={background_gradient_config.x2}
              y2={background_gradient_config.y2}>
              <Stop
                offset={background_gradient_config.stop2.offset}
                stopColor={background_gradient_config.stop2.stopColor}
                stopOpacity={background_gradient_config.stop2.stopOpacity}
              />
              <Stop
                offset={background_gradient_config.stop3.offset}
                stopColor={background_gradient_config.stop3.stopColor}
                stopOpacity={background_gradient_config.stop3.stopOpacity}
              />
              <Stop
                offset={background_gradient_config.stop4.offset}
                stopColor={background_gradient_config.stop4.stopColor}
                stopOpacity={background_gradient_config.stop4.stopOpacity}
              />
              <Stop
                offset={background_gradient_config.stop1.offset}
                stopColor={background_gradient_config.stop1.stopColor}
                stopOpacity={background_gradient_config.stop1.stopOpacity}
              />
            </LinearGradient>
          ) : null}
        </Defs>
        {render_background()}
        {render_x_axis()}
        {render_y_axis()}
        {render_x_axis_ticks()}
        {render_x_axis_labels()}
        {render_y_axis_ticks()}
        {render_y_axis_labels()}
        {yAxisLabels?.length > 0 && render_barchart()}
        {tooltipVisible && render_tooltips()}
      </Svg>
    </View>
  );
};

export default BarChart;
