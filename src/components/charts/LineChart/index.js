import React, {useState, useEffect, useRef} from 'react';
import {View, Animated, Easing, Dimensions} from 'react-native';
import styles from './styles';
import Svg, {
  G,
  Line,
  Circle,
  Path,
  Rect,
  Text as SvgText,
} from 'react-native-svg';

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
  axisFontSize = 12,
  useMinYValue = false,
  curve = false,
  lineCircleStroke = '#fff',
  lineCircleStrokeWidth = 2,
  lineCircleFill = 'transparent',
  lineCircleRadius = 5,
  lineStrokeWidth = 2,
  lineStroke = 'blue',
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
  const x_margin = 50;
  const y_margin = 50;
  const padding_from_screenBorder = 20;

  const quickSort = arr => {
    if (arr.length <= 1) {
      return arr;
    }

    let pivot = arr[0];
    let leftArr = [];
    let rightArr = [];

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < pivot) {
        leftArr.push(arr[i]);
      } else {
        rightArr.push(arr[i]);
      }
    }

    return [...quickSort(leftArr), pivot, ...quickSort(rightArr)];
  };

  useEffect(() => {
    const yKeys = data.map(item => item[y_key]);
    const yAxisData = quickSort(yKeys);
    setYAxisLabels(yAxisData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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

  const render_x_axis_labels = () => {
    return data.map((item, index) => {
      const {gap_between_ticks} = calculateWidth();
      const x = x_margin + gap_between_ticks * index;
      const y = containerHeight - y_margin + 10 + axisFontSize;
      const {rotation, fontSize, fontColor, textAnchor, fontWeight} =
        x_axis_label_config;
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
    console.log(dPath);
    return dPath;
  };

  const render_line = () => {
    const dPath = getDPath();
    return <Path d={dPath} strokeWidth={lineStrokeWidth} stroke={lineStroke} />;
  };

  return (
    <View
      style={[
        styles.svgWrapper,
        {height: containerHeight, width: containerWidth},
      ]}>
      <Svg height="100%" width="100%" style={styles.svgStyle}>
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
