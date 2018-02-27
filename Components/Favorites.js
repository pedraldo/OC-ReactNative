import React from 'react'
import { StyleSheet, View, Text, Button, FlatList, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import FilmItem from './FilmItem'
import FilmList from './FilmList'

class Favorites extends React.Component {
    constructor(props) {
        super(props)
    }

    _displayDetailForFilm = (idFilm) => {
        this.props.navigation.navigate("FilmDetail", { idFilm })
    }

    render() {
        return (
            <View style={styles.main_container}>
                {/* <FlatList
                    data={this.props.favoriteFilms}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => <FilmItem film={item} isFavoriteFilm={false} displayDetailForFilm={this._displayDetailForFilm}/>}
                /> */}
                <FilmList
                    films={this.props.favoriteFilms}
                    displayDetailForFilm={this._displayDetailForFilm}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1
    }
})

const mapStateToProps = (state) => {
    return {
        favoriteFilms: state.favoriteFilms
    }
}

export default connect(mapStateToProps)(Favorites)