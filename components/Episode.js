import React from 'react';
import {WebView} from 'react-native-webview';

import CSS from './css';

export default function Episode(props) {

  return (
    <WebView
        originWhitelist={['*']}
        source={{ html: `${CSS} ${props.navigation.getParam("content")}` }}
      />
  );
}

Episode.navigationOptions = props => ({
    title: props.navigation.getParam("title")
});
