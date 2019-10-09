import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Home from './components/Home';
import Episode from './components/Episode';

const AppNavigator = createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            title: "Home"
        }
    },
    Episode: {
        screen: Episode
    }
});

export default createAppContainer(AppNavigator);