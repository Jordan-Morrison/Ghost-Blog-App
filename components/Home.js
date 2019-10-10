import React, {useState, useEffect} from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Home(props) {

    const [posts, setPosts] = useState([]);

    useEffect( () => {
        getPosts();
    },[]);

    async function getPosts() {
        let data = await fetch("https://demo.ghost.io/ghost/api/v2/content/posts/?key=22444f78447824223cefc48062");
        data = await data.json();
        setPosts(data.posts);
    }

    function ListItem(post) {
        return (
            <TouchableOpacity style={styles.listItem} onPress={() => {props.navigation.navigate("Episode", {content: post.html, title: post.title})}}>
                <Text>{post.title}</Text>
                <TouchableOpacity>
                    <Ionicons style={styles.downloadIcon} name="ios-add" size={25}/>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }

  return (
    <View style={styles.container}>
        <FlatList style={styles.list} data={posts} renderItem={({item}) => <ListItem title={item.title} html={item.html} />} keyExtractor={item => item.id}/>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
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
    justifyContent: "space-between"
  },
  downloadIcon: {
      paddingHorizontal: 20,
      paddingVertical: 20
  },
  list: {
      marginLeft: 20
  }
});

// import React from 'react';
// import { StyleSheet, View } from 'react-native';
// import {Text, Icon, List, ListItem, Left, Right} from 'native-base';
// import { Ionicons } from '@expo/vector-icons';

// export default function Home() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <Ionicons name="md-checkmark-circle" size={32} color="green" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

