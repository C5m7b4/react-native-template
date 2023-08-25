import React from 'react';
import {StatusBar} from 'react-native';
import ErrorBoundary from './src/common/ErrorBoundary';
import Toast from './src/common/Toast';
import Base from './src/Base';
import store from './src/store';
import {Provider} from 'react-redux';

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Toast />
        <Base />
        <StatusBar />
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
