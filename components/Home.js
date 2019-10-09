import React, {useState, useEffect} from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import {Text, Icon, List, ListItem, Left, Right} from 'native-base';

export default function Home(props) {

    const [posts, setPosts] = useState(null);

    useEffect( () => {
        getPosts();
    },[]);

    async function getPosts() {
        let data = await fetch("https://demo.ghost.io/ghost/api/v2/content/posts/?key=22444f78447824223cefc48062");
        data = await data.json();
        setPosts(data.posts);
    }

    function viewPost(ev) {
        
    }

  return (
    <ScrollView style={styles.container}>
      <List>
          {posts && posts.map( (post)=>(
                <ListItem key={post.id} onPress={() => {
                    props.navigation.navigate("Episode", {
                        content: post.html,
                        title: post.title
                    });
                }}>
                    <Left>
                        <Text>{post.title}</Text>
                    </Left>
                    <Right>
                        <Icon name="arrow-forward" />
                    </Right>
                </ListItem>
            )) }
      </List>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

// import React from 'react';
// import { StyleSheet, View } from 'react-native';
// import {Text, List, ListItem, Left, Right} from 'native-base';
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

