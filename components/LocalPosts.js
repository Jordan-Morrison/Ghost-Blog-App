import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, ListItem, TouchableOpacity} from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import * as FileSystem from 'expo-file-system';

function Post(props) {

    const [posts, setPosts] = useState([]);

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

    if (props.isFocused){
        getLocalPosts();
    }

    function ListItem(post) {
        return (
            <TouchableOpacity style={styles.listItem} onPress={() => {props.navigation.navigate("Episode", {content: post.data.html, title: post.data.title})}}>
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
      paddingVertical: 20
    },
    list: {
        marginLeft: 20
    }
  });

Post.navigationOptions = props => ({
    title: props.navigation.getParam("title")
});

export default withNavigationFocus(Post);
