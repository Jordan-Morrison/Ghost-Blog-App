import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {downloadPost} from './helpers/Downloader';

export default function Card(props) {

  return (
    <TouchableOpacity style={styles.card} delayPressIn={50} onPress={props.navigate}>
        <View style={{borderTopRightRadius: 10, borderTopLeftRadius: 10, overflow: "hidden"}}>
        <Image style={styles.featuredImage} source={{uri: props.post.feature_image}}/>
        </View>
        <View style={styles.contentView}>
            <View style={styles.tagAndDownloadBar}>
                <Text style={styles.primaryTag}>{props.post.primary_tag ? props.post.primary_tag.name : "gg"}</Text>
                <TouchableOpacity onPress={() => {downloadPost(props.post)}}>
                    <Ionicons style={styles.downloadIcon} name="ios-add" size={25}/>
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>{props.post.title}</Text>
            <Text style={styles.description}>{props.post.excerpt}</Text>
            <Text style={styles.timeText}>6 days ago &bull; 2 min read</Text>
        </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    card: {
        display: "flex",
        marginHorizontal: 20,
        marginVertical: 10,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 1,
        shadowRadius: 10
    },
    featuredImage: {
        width: "100%",
        height: 200,
        overflow: "hidden",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    contentView: {
        backgroundColor: "#F4F5F5",
        padding: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    tagAndDownloadBar: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    primaryTag: {
        fontSize: 14,
        flexGrow: 1
    },
    title: {
        fontWeight: "500",
        fontSize: 19,
        lineHeight: 26,
        paddingVertical: 5
    },
    description: {
        fontSize: 14,
        paddingVertical: 5
    },
    timeText: {
        fontSize: 12,
        paddingVertical: 5
    },
    downloadIcon: {
        // paddingHorizontal: 20,
        // paddingVertical: 20
    }
});


// const styles = StyleSheet.create({
//     listItem: {
//         borderRadius: 4,
//         borderRightWidth: 0,
//         borderLeftWidth: 0,
//         borderStartColor: "red",
//         borderWidth: 0.5,
//         borderColor: '#d6d7da',
//         display: "flex",
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-between"
//     },
//     postTitle: {
//         flexShrink: 1
//     },
//     postTitle: {
//         flexShrink: 1
//     },
//     downloadIcon: {
//         paddingHorizontal: 20,
//         paddingVertical: 20
//     }
// });