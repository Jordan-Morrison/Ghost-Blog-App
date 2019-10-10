import React from 'react';
import {View, Text} from 'react-native';
import {WebView} from 'react-native-webview';

import CSS from './css';

export default function Episode(props) {

  return (
        <View>
            <Text>Hello World</Text>
        </View>
  );
}

Episode.navigationOptions = props => ({
    title: props.navigation.getParam("title")
});
