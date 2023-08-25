import {DeviceEventEmitter} from 'react-native';
const SHOW_TOAST_MESSAGE = 'SHOW_TOAST_MESSAGE';

const toast = {
  info: options => {
    DeviceEventEmitter.emit(SHOW_TOAST_MESSAGE, {...options, type: 'info'});
  },
  success: options => {
    DeviceEventEmitter.emit(SHOW_TOAST_MESSAGE, {
      ...options,
      type: 'success',
    });
  },
  danger: options => {
    DeviceEventEmitter.emit(SHOW_TOAST_MESSAGE, {...options, type: 'danger'});
  },
  error: options => {
    console.log('toast:Error:occured: ', options);
    DeviceEventEmitter.emit(SHOW_TOAST_MESSAGE, {...options, type: 'error'});
  },
  warning: options => {
    console.log('toast:warning:occured: ', options);
    DeviceEventEmitter.emit(SHOW_TOAST_MESSAGE, {
      ...options,
      type: 'warning',
    });
  },
  warn: options => {
    console.log('toast:warn:occured: ', options);
    DeviceEventEmitter.emit(SHOW_TOAST_MESSAGE, {
      ...options,
      type: 'warning',
    });
  },
};

export default toast;
