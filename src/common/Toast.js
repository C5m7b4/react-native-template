import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  DeviceEventEmitter,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

const SHOW_TOAST_MESSAGE = 'SHOW_TOAST_MESSAGE';

const colors = {
  info: '#0366fc',
  success: '#28a745',
  danger: '#dc3545',
  error: '#dc3545',
  warning: '#db9318',
};

const Toast = () => {
  const [messageType, setMessageType] = useState(null);
  const [message, setMessage] = useState(null);
  const [duration, setDuration] = useState(5000);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const timeoutRef = useRef(null);

  useEffect(() => {
    DeviceEventEmitter.addListener(SHOW_TOAST_MESSAGE, onNewToast);

    return () => {
      DeviceEventEmitter.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (message) {
      timeoutRef.current = setInterval(() => {
        if (duration === 0) {
          closeToast();
        } else {
          setDuration(prev => prev - 1000);
        }
      }, 1000);
    }

    return () => {
      clearInterval(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, duration]);

  // console.log('duration', duration);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const onNewToast = data => {
    if (data.duration) {
      setDuration(data.duration);
    }

    setMessage(data.message);
    setMessageType(data.type);
  };

  const closeToast = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 5000,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      setMessage(null);
      setDuration(5000);
    }, 500);

    clearInterval(timeoutRef.current);
  };

  if (!message) {
    return null;
  }

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: '6%',
          left: '4%',
          right: '4%',
          backgroundColor: colors[messageType],
          zIndex: 10,
          elevation: 2,
          borderRadius: 10,
        },
        {opacity: fadeAnim},
      ]}>
      <TouchableOpacity onPress={closeToast}>
        <Text style={styles.text}>{message}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: '4%',
    left: '4%',
    right: '4%',
    zIndex: 1,
    elevation: 1,
    borderRadius: 10,
  },
  text: {
    padding: 14,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Toast;
