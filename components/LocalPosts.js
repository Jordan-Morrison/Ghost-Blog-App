import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import Swipeout from 'react-native-swipeout';
import * as FileSystem from 'expo-file-system';

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
                <TouchableOpacity style={styles.listItem} onPress={() => {viewLocalPost(post.data.uuid, post.data.title)}}>
                    <View style={{display: "flex", flexDirection: "row", position: "relative"}}>
                        <View style={{backgroundColor: "red", width: 20, height: "100%"}}/>
                        <Text>{post.data.title}</Text>
                    </View>
                </TouchableOpacity>
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
      backgroundColor: '#fff',
    },
    listItem: {
        borderRadius: 4,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderStartColor: "red",
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 30
    },
    list: {
        marginLeft: 0
    }
  });

export default withNavigationFocus(Post);
