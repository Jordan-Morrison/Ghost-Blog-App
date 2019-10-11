import React from 'react';
import {WebView} from 'react-native-webview';
import * as FileSystem from 'expo-file-system';

import CSS from './css';

export default function Episode(props) {

    console.log("URI: ", props.navigation.getParam("uri"));

  return (
        <WebView
    originWhitelist={['*']}
    source={{ uri: props.navigation.getParam("uri") }}
    allowFileAccess={true}
    allowingReadAccessToURL={FileSystem.documentDirectory}
    />
  );
}

Episode.navigationOptions = props => ({
    title: props.navigation.getParam("title")
});
