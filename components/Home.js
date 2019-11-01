import React, {useState, useEffect} from 'react';
import { FlatList, StyleSheet, View} from 'react-native';

import Card from './Card';

export default function Home(props) {

    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect( () => {
        getPosts();
    },[]);

    async function getPosts() {
        setRefreshing(true);
        props.refreshing = true;
        let data = await fetch("http://localhost:2368/ghost/api/v2/content/posts/?key=67fee21a30c345d85f0baf9264&include=tags");
        data = await data.json();
        setPosts(data.posts);
        setRefreshing(false);
    }

  return (
    <View style={styles.container}>
        <FlatList refreshing={refreshing} onRefresh={getPosts} style={styles.list} data={posts} renderItem={({item}) => <Card post={item} navigation={props.navigation}/>} keyExtractor={item => item.uuid}/>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});