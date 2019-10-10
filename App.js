import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from './components/Home';
import Episode from './components/Episode';
import LocalEpisodes from './components/LocalEpisodes';

const OnlineNavigator = createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            title: "Home"
        },
    },
    Episode: {
        screen: Episode
    }
},
{
    initialRouteName: "Home"
});

const OfflineNavigator = createStackNavigator({
    Saved: {
        screen: LocalEpisodes,
        navigationOptions: {
            title: "My Episodes"
        }
    },
    Episode: Episode
})

const TabNavigator = createBottomTabNavigator({
    Home: {
        screen: OnlineNavigator,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => {
                return <Ionicons name="ios-home" size={25} color={tintColor} />;
              }
        }
    },
    Saved: {
        screen: OfflineNavigator,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => {
                return <Ionicons name="ios-folder" size={25} color={tintColor} />;
              }
        }
    }
});

export default createAppContainer(TabNavigator);