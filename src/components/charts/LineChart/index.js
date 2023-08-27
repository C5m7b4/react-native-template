import React, {useState, useEffect, useRef} from 'react';
import {View, Animated, Easing, Dimensions} from 'react-native';
import styles from './styles';
import {quickSort} from '../../../helpers';
import Svg, {
  G,
  Line,
  Circle,
  Path,
  Rect,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const {width: cWidth} = Dimensions.get('window');

const LineChart = ({
  data = [],
  onPressItem,
  x_key = 'month',
  y_key = 'value',
  height: containerHeight = 300,
  width: containerWidth = cWidth,
  axisWidth = 2,
  axisColor = '#fff',
  axisCircleColor = '#fff',
  axisCircleRadius = 5,
  // axisFontSize = 12,
  useMinYValue = false,
  curve = false,
  animated = true,
  lineCircleStroke = '#fff',
  lineCircleStrokeWidth = 2,
  lineCircleFill = 'transparent',
  lineCircleRadius = 5,
  lineStrokeWidth = 2,
  lineStroke = 'blue',
  lineGradient = true,
  useBackgroundGradient = true,
  verticalLines = true,
  verticalLineOpacity = 0.2,
  horizontalLines = false,
  horizontalLineOpacity = 0.2,
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
  line_fill_gradient_config = {
    stop1: {
      offset: 0,
      stopColor: '#cb5dcf',
      stopOpacity: 0.3,
    },
    stop2: {
      offset: 1,
      stopColor: '#99469c',
      stopOpacity: 0.5,
    },
  },
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
  tooltipVisible = false,
  tooltip_config = {
    tooltipHeight: 20,
    tooltipWidth: 40,
    tooltipFill: '#fff',
    tooltipBorderRadius: 7,
    fontSize: 12,
    fontWeight: '400',
    textAnchor: 'middle',
  },
}) => {
  const [yAxisLabels, setYAxisLabels] = useState([]);
  const [pathLength, setPathLength] = useState(0);
  const x_margin = 50;
  const y_margin = 50;
  const padding_from_screenBorder = 20;

  const animated_path_ref = useRef(null);
  const animated_path_length = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const yKeys = data.map(item => item[y_key]);
    const yAxisData = quickSort(yKeys);
    setYAxisLabels(yAxisData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    animated_path_length.setValue(0);
    Animated.timing(animated_path_length, {
      toValue: pathLength,
      duration: 1500,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathLength]);

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

  const calculateWidth = () => {
    const chartWidth = containerWidth - x_margin - padding_from_screenBorder;
    const gap_between_ticks = chartWidth / (data.length - 1);
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

  const render_x_axis = () => {
    return (
      <G key="x-axis">
        <Circle
          cx={x_margin}
          cy={containerHeight - y_margin}
          r={axisCircleRadius}
          stroke={axisCircleColor}
          strokeWidth={axisWidth}
          fill={axisCircleColor}
        />
        <Circle
          cx={containerWidth - padding_from_screenBorder}
          cy={containerHeight - y_margin}
          r={axisCircleRadius}
          stroke={axisCircleColor}
          strokeWidth={axisWidth}
          fill={axisCircleColor}
        />
        <Line
          x1={x_margin}
          y1={containerHeight - y_margin}
          x2={containerWidth - padding_from_screenBorder}
          y2={containerHeight - y_margin}
          stroke={axisColor}
          strokeWidth={axisWidth}
        />
      </G>
    );
  };

  const render_y_axis = () => {
    return (
      <G key="y-axis">
        <Circle
          cx={x_margin}
          cy={y_margin}
          r={axisCircleRadius}
          stroke={axisCircleColor}
          strokeWidth={axisWidth}
          fill={axisCircleColor}
        />
        <Line
          x1={x_margin}
          y1={containerHeight - y_margin}
          x2={x_margin}
          y2={y_margin}
          stroke={axisColor}
          strokeWidth={axisWidth}
        />
      </G>
    );
  };

  const render_x_axis_ticks = () => {
    const {gap_between_ticks} = calculateWidth();
    return data.map((item, index) => {
      const x = x_margin + gap_between_ticks * index;
      const y = containerHeight - y_margin;
      return (
        <G key={`x-axis_ticks_${index}`}>
          <Line
            x1={x}
            y1={y}
            x2={x}
            y2={y + 10}
            stroke={axisColor}
            strokeWidth={axisWidth}
          />
        </G>
      );
    });
  };

  const render_vertical_lines = () => {
    const {gap_between_ticks} = calculateWidth();

    return data.map((item, index) => {
      const x = x_margin + gap_between_ticks * index;

      return (
        <G key={`vertical_lines_${index}`}>
          <Line
            x1={x}
            y1={containerHeight - y_margin}
            x2={x}
            y2={y_margin}
            stroke={axisColor}
            strokeWidth={axisWidth}
            opacity={verticalLineOpacity}
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
      const x = x_margin + gap_between_ticks * index;
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
            stroke={axisColor}
            strokeWidth={axisWidth}
          />
        </G>
      );
    });
  };

  const render_horizontal_lines = () => {
    const {gap_between_ticks} = calculateHeight();
    return data.map((item, index) => {
      const y = containerHeight - y_margin - gap_between_ticks * index;
      return (
        <G key={`horizontal_line_${index}`}>
          <Line
            x1={x_margin}
            y1={y}
            x2={containerWidth - padding_from_screenBorder}
            y2={y}
            stroke={axisColor}
            strokeWidth={axisWidth}
            opacity={horizontalLineOpacity}
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

  const render_line_circles = () => {
    const {gap_between_ticks: x_gap} = calculateWidth();
    const {gap_between_ticks: y_gap, yMax, y_value_gap} = calculateHeight();
    const {
      tooltipWidth,
      tooltipHeight,
      tooltipFill,
      tooltipBorderRadius,
      fontSize,
      fontWeight,
      textAnchor,
    } = tooltip_config;
    return data.map((item, index) => {
      const x = x_margin + x_gap * index;
      const y = (yMax - item[y_key]) * (y_gap / y_value_gap) + y_margin;

      return (
        <G key={`chart-line-${index}`}>
          <Circle
            cx={x}
            cy={y}
            r={lineCircleRadius}
            stroke={lineCircleStroke}
            strokeWidth={lineCircleStrokeWidth}
            fill={lineCircleFill}
            onPress={() => onPressItem(item)}
          />
          {tooltipVisible ? (
            <G key={`tooltip-${index}`}>
              <Line
                key={`tooltip-line-${index}`}
                x1={x}
                y1={y - lineCircleRadius / 2}
                x2={x}
                y2={y - lineCircleRadius / 2 - 10}
                stroke={'#fff'}
                strokeWidth={2}
                opacity={1}
              />
              <Rect
                key={`tooltip-rect-${index}`}
                x={x - tooltipWidth / 2}
                y={y - lineCircleRadius / 2 - tooltipHeight - 10}
                width={tooltipWidth}
                height={tooltipHeight}
                fill={tooltipFill}
                rx={tooltipBorderRadius}
                opacity={1}
                onPress={() => onPressItem(item)}
              />
              <SvgText
                key={`tooltip-text-${index}`}
                x={x}
                y={y - lineCircleRadius / 2 - tooltipHeight / 2 - 5}
                fontSize={fontSize}
                fontWeight={fontWeight}
                textAnchor={textAnchor}
                opacity={1}>
                {item[y_key]}
              </SvgText>
            </G>
          ) : null}
        </G>
      );
    });
  };

  const getDPath = () => {
    const {gap_between_ticks: x_gap} = calculateWidth();
    const {gap_between_ticks: y_gap, yMax, y_value_gap} = calculateHeight();
    let dPath = '';
    let prevXValue = 0;
    let prevYValue = 0;
    data.map((item, index) => {
      let x = x_margin + x_gap * index;
      let y = (yMax - item[y_key]) * (y_gap / y_value_gap) + y_margin;
      if (curve) {
        if (index === 0) {
          dPath += `M${x},${y} `;
          prevXValue = x;
          prevYValue = y;
        } else {
          const x_splitter = (x - prevXValue) / 4;
          const y_splitter = (y - prevYValue) / 2;
          dPath +=
            ` Q ${prevXValue + x_splitter},${prevYValue},${
              prevXValue + x_splitter * 2
            },${prevYValue + y_splitter}` +
            ` Q ${prevXValue + x_splitter * 3},${
              prevYValue + y_splitter * 2
            },${x},${y}`;
          prevXValue = x;
          prevYValue = y;
        }
      } else {
        if (index === 0) {
          dPath += `M${x},${y}`;
        } else {
          dPath += ` L${x},${y}`;
        }
      }
    });
    // console.log(dPath);
    return dPath;
  };

  const render_line = () => {
    const dPath = getDPath();
    console.log('linePath', dPath);
    // console.log('pathLength', animated_path_ref?.current.getTotalLength());
    if (animated) {
      return (
        <AnimatedPath
          ref={animated_path_ref}
          // onLayout={() =>
          //   setPathLength(animated_path_ref?.current.getTotalLength())
          // }
          d={dPath}
          strokeWidth={lineStrokeWidth}
          stroke={lineStroke}
          strokeDashArray={pathLength}
          strokeDashoffset={animated_path_length}
          fill={'transparent'}
          opacity={1}
        />
      );
    }
    return <Path d={dPath} strokeWidth={lineStrokeWidth} stroke={lineStroke} />;
  };

  const render_chart_gradient = () => {
    let dPath = getDPath();
    dPath += `L ${containerWidth - padding_from_screenBorder}, ${
      containerHeight - y_margin
    } L ${x_margin}, ${containerHeight - y_margin} Z`;
    return <Path d={dPath} fill={'url(#fillShadowGradient)'} strokeWidth={0} />;
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
            id="fillShadowGradient"
            gradientUnits={'userSpaceOnUse'}
            x1={0}
            y1={0}
            x2={0}
            y2={containerHeight}>
            <Stop
              offset={line_fill_gradient_config.stop1.offset}
              stopColor={line_fill_gradient_config.stop1.stopColor}
              stopOpacity={line_fill_gradient_config.stop1.stopOpacity}
            />
            <Stop
              offset={line_fill_gradient_config.stop2.offset}
              stopColor={line_fill_gradient_config.stop2.stopColor}
              stopOpacity={line_fill_gradient_config.stop2.stopOpacity}
            />
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
        {lineGradient && render_chart_gradient()}
        {verticalLines && render_vertical_lines()}
        {horizontalLines && render_horizontal_lines()}
        {render_x_axis()}
        {render_y_axis()}
        {render_x_axis_ticks()}
        {render_x_axis_labels()}
        {render_y_axis_ticks()}
        {render_y_axis_labels()}

        {render_line()}
        {render_line_circles()}
      </Svg>
    </View>
  );
};

export default LineChart;
