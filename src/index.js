import React from 'react';
import { StatusBar, YellowBox } from 'react-native';

import './config/ReactotroConfig';

import Routes from './routes';

YellowBox.ignoreWarnings([
  '`-[RCTRootView cancelTouches]` is deprecated and will be deleted soon.', // https://github.com/kmagiera/react-native-gesture-handler/issues/746
]);

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159C1" />
      <Routes />
    </>
  );
}
