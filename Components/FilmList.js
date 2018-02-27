import React from 'react'
import { StyleSheet, View, Text, Button, FlatList, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import FilmItem from './FilmItem'

class FilmList extends React.Component {
    constructor(props) {
        super(props)
    }

    _isFavoriteFilm(idFilm) {
        return !!this.props.favoriteFilms.find(film => film.id === idFilm)
    }
    
    render() {
        const { films, displayDetailForFilm } = this.props
        return (
            <View style={styles.main_container}>
                <FlatList
                    data={films}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => <FilmItem film={item} isFavoriteFilm={this._isFavoriteFilm(item.id)} displayDetailForFilm={displayDetailForFilm}/>}
                    onEndReachedThreshold={this.props.onEndReachedThreshold}
                    onEndReached={this.props.onEndReached}
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

export default connect(mapStateToProps)(FilmList)