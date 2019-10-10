import React, {useState, useEffect} from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

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

    async function downloadPost(uuid, html) {
        let imageTagRegex = new RegExp('<img(.+?)src\s*=\s*\\"(.+?)\\"', "g");
        
        let imageTags = html.match(imageTagRegex);

        let imagesToDownload = await imageTags.map(tag => {
            let url = tag.match(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g)[0];
            return {
                url: url,
                name: url.match(/[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/g)[0]
            }
        });

        imagesToDownload = [...new Set(imagesToDownload)];

        for (let image in imagesToDownload){
            image = imagesToDownload[image];

            let fileName = `${imagesToDownload.indexOf(image)}-${image.name}`;
            let downloaded = await FileSystem.downloadAsync(image.url, FileSystem.documentDirectory + fileName).catch(err => {
                console.error(err);
            });
            if (downloaded.uri){
                // imagesToDownload[imagesToDownload.indexOf(image)].path = downloaded.uri;

                html = html.split(image.url).join("data:image/gif;base64, " + await FileSystem.readAsStringAsync(downloaded.uri, {
                    encoding: FileSystem.EncodingType.Base64
                }));

            }
        }

        console.log(html);
        console.log(imagesToDownload);

        FileSystem.writeAsStringAsync(`${FileSystem.documentDirectory}post.html`, html).catch(err => {
            console.error(err);
        });

        props.navigation.navigate("Episode", {content: await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}post.html`), title: "PLZ WORK"})

        // FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + uuid).catch(err => {
        //     console.log("Directory already exists");
        // });
        
        // FileSystem.writeAsStringAsync(`${FileSystem.documentDirectory}${uuid}/post.html`, html).catch(err => {
        //     console.error(err);
        // });

        console.log(await FileSystem.readDirectoryAsync(FileSystem.documentDirectory));
    }

    function ListItem(post) {
        return (
            <TouchableOpacity style={styles.listItem} onPress={() => {props.navigation.navigate("Episode", {content: post.html, title: post.title})}}>
                <Text>{post.title}</Text>
                <TouchableOpacity onPress={() => {downloadPost(post.uuid, post.html)}}>
                    <Ionicons style={styles.downloadIcon} name="ios-add" size={25}/>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }

  return (
    <View style={styles.container}>
        <FlatList style={styles.list} data={posts} renderItem={({item}) => <ListItem title={item.title} html={item.html} uuid={item.uuid} />} keyExtractor={item => item.uuid}/>
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

