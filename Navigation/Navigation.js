import React from 'react'
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation'
import Icon from 'react-native-vector-icons/FontAwesome'
import Search from '../Components/Search'
import FilmDetail from '../Components/FilmDetail'
import Favorites from '../Components/Favorites'

const SearchStackNavigator = StackNavigator({
    Search: {
        screen: Search,
        navigationOptions: {
            title: 'Rechercher'
        }
    },
    FilmDetail: {
        screen: FilmDetail
    }
})

const FavoritesStackNavigator = StackNavigator({
    Favorites: {
        screen: Favorites,
        navigationOptions: {
            title: 'Films favoris'
        }
    },
    FilmDetail: {
        screen: FilmDetail
    }
})

// export default SearchStackNavigator

export default TabNavigator(
    {
        Search: { screen: SearchStackNavigator },
        Favorites: { screen: FavoritesStackNavigator }
    }, {
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state
                let iconName

                if (routeName === 'Search') {
                    iconName = 'search'
                } else if (routeName === 'Favorites') {
                    iconName = 'star'
                }

                return <Icon name={iconName} size={25} color={tintColor}/>
            }
        }),
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        tabBarOptions: {
            activeTintColor: 'dodgerblue',
            inactiveTintColor: 'gray'
        },
        animationEnabled: false,
        swipeEnabled: false
    }
)