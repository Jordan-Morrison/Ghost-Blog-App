import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import Swipeout from 'react-native-swipeout';
import * as FileSystem from 'expo-file-system';

import Card from './Card';

function Post(props) {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (props.isFocused){
            getLocalPosts();
        }
    },[props.isFocused]);

    async function getLocalPosts() {
        let postFolders = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "posts").catch(err => {
            console.log(err);
        })

        let postArray = [];
        for (let folder in postFolders){
            folder = postFolders[folder];

            let postData = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + "posts/" + folder + "/post.json").catch(err => {
                console.error(err);
            })

            postArray.push(JSON.parse(postData));
        }

        setPosts(postArray);
    }

    function viewLocalPost(uuid, title) {
        let uri = FileSystem.documentDirectory + "posts/" + uuid + "/post.html";
        props.navigation.navigate("Episode", {uri: uri, title: title})
    }

    async function deleteLocalPost(uuid) {
        await FileSystem.deleteAsync(FileSystem.documentDirectory + "posts/" + uuid).catch(err => {
            console.error(err);
            return false;
        });

        setPosts(posts.filter(post => post.uuid != uuid));
    }

    function ListItem(post) {

        let swipeoutButtons = [{
            text: "Delete",
            backgroundColor: "red",
            onPress: () => deleteLocalPost(post.data.uuid)
        }];

        return (
            <Swipeout autoClose={true} backgroundColor="none" right={swipeoutButtons}>
                <Card post={post.data} navigate={() => viewLocalPost(post.data.uuid, post.data.title)}/>
            </Swipeout>
        );
    }

  return (
    <View style={styles.container}>
        <FlatList style={styles.list} data={posts} renderItem={({item}) => <ListItem data={item} />} keyExtractor={item => item.uuid}/>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff'
    }
  });

export default withNavigationFocus(Post);
