import React from 'react';
import {WebView} from 'react-native-webview';
import * as FileSystem from 'expo-file-system';

import CSS from './css';

export default function Episode(props) {

    // The content prop is passed if loading html from online
    if (props.navigation.getParam("content")){
        return (
            <WebView
                originWhitelist={['*']}
                source={{ html: `${CSS} ${props.navigation.getParam("content")}` }}
            />
        );
    }

    // Shown if the content is being loaded from the file system
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
