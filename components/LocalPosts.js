import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { withNavigationFocus } from 'react-navigation';
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

    function ListItem(post) {
        return (
            <TouchableOpacity style={styles.listItem} onPress={() => {viewLocalPost(post.data.uuid, post.data.title)}}>
                <Text>{post.data.title}</Text>
            </TouchableOpacity>
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
        marginLeft: 20
    }
  });

export default withNavigationFocus(Post);
