import React, {useState, useEffect} from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {downloadPost} from './helpers/Downloader';

export default function Home(props) {

    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect( () => {
        getPosts();
    },[]);

    async function getPosts() {
        setRefreshing(true);
        props.refreshing = true;
        let data = await fetch("http://localhost:2368/ghost/api/v2/content/posts/?key=67fee21a30c345d85f0baf9264");
        data = await data.json();
        setPosts(data.posts);
        setRefreshing(false);
    }

    function ListItem(post) {
        return (
            <TouchableOpacity style={styles.listItem} onPress={() => {props.navigation.navigate("Episode", {content: post.data.html, title: post.data.title})}}>
                <Text style={styles.postTitle}>{post.data.title}</Text>
                <TouchableOpacity onPress={() => {downloadPost(post.data)}}>
                    <Ionicons style={styles.downloadIcon} name="ios-add" size={25}/>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }

  return (
    <View style={styles.container}>
        <FlatList refreshing={refreshing} onRefresh={getPosts} style={styles.list} data={posts} renderItem={({item}) => <ListItem data={item} />} keyExtractor={item => item.uuid}/>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
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
  },
  postTitle: {
    flexShrink: 1
  },
  downloadIcon: {
      paddingHorizontal: 20,
      paddingVertical: 20
  },
  list: {
      marginLeft: 20
  }
});