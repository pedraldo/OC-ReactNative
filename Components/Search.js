import React from 'react'
import { StyleSheet, View, TextInput, Button, FlatList, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import FilmItem from './FilmItem'
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi'
import FilmDetail from './FilmDetail'
import FilmList from './FilmList'

class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = { 
            films: [], 
            searchedText: '',
            isLoading: false,
            page: 0,
            totalPages: 0
        }
    }

    _searchFilms() {
        this.setState({
            films: [],
            page: 0,
            totalPages: 1
        }, () => {
            this._loadFilms()
        })
    }

    _loadFilms() {
        if (this.state.searchedText.length > 0) {
            this.setState({ isLoading: true })
            getFilmsFromApiWithSearchedText(this.state.searchedText, (this.state.page + 1)).then(data => {
                this.setState({ 
                    films: [...this.state.films, ...data.results], 
                    isLoading: false,
                    page: data.page,
                    totalPages: data.total_pages 
                })
            })
        }
    }

    _searchTextInputChanged(text) {
        this.setState({ searchedText: text})
    }

    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large'/>
                </View>
            )
        }
    }

    _displayDetailForFilm = (idFilm) => {
        this.props.navigation.navigate("FilmDetail", { idFilm })
    }

    _isFavoriteFilm(idFilm) {
        return !!this.props.favoriteFilms.find(film => film.id === idFilm)
    }

    render() {
        return (
            <View style={styles.main_container}>
                <TextInput 
                    style={styles.textinput} 
                    placeholder="Titre du film"
                    onChangeText={(text => this._searchTextInputChanged(text))}
                    onSubmitEditing={() => this._searchFilms()}
                />
                <Button style={{ height: 50 }} title="Rechercher" onPress={() => this._searchFilms()}></Button>
                {/* <FlatList
                    data={this.state.films}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => <FilmItem film={item} isFavoriteFilm={this._isFavoriteFilm(item.id)} displayDetailForFilm={this._displayDetailForFilm}/>}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        if (this.state.films.length > 0) {
                            this._loadFilms()
                        }
                    }}
                /> */}
                <FilmList
                    films={this.state.films}
                    displayDetailForFilm={this._displayDetailForFilm}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        if (this.state.films.length > 0) {
                            this._loadFilms()
                        }
                    }}
                />

                {this._displayLoading()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1
    },
    textinput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

const mapStateToProps = (state) => {
    return {
        favoriteFilms: state.favoriteFilms
    }
}

export default connect(mapStateToProps)(Search)