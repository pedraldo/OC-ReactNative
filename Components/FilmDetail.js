import React from 'react'
import numeral from 'numeral'
import moment from 'moment'
import { StyleSheet, View, Text, Image, ActivityIndicator, ScrollView, TouchableOpacity, Modal, Dimensions, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import ImageZoom from 'react-native-image-pan-zoom'
import { getFilmDetailFromApi, getImageFromApi } from '../API/TMDBApi'

class FilmDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            film: undefined,
            isLoading: true,
            showImageView: false,
            imagePosterUrl: '',
            imagePosterSize: {
                width: 0,
                height: 0
            }
        }
    }

    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size="large" />
                </View>
            )
        }
    }

    _displayFilm() {
        const { film } = this.state
        if (film !== undefined) {
            return (
                <ScrollView style={styles.scrollView_container}>
                    <StatusBar hidden={this.state.showImageView}/>
                    <TouchableOpacity
                        onPress={() => this.setState({showImageView: true})}>
                        <Image
                            style={styles.image}
                            source={{ uri: this.state.imagePosterUrl }}
                        />
                    </TouchableOpacity>
                    <Text style={styles.title_text}>{film.title}</Text>
                    <TouchableOpacity
                        style={styles.favorite_container}
                        onPress={() => this._toggleFavorite()}>
                        {this._displayFavoriteImage()}
                    </TouchableOpacity>
                    <Text style={styles.overview_text}>{film.overview}</Text>
                    <Text style={styles.infos_text}>Sorti le {moment(new Date(film.release_date)).format('DD/MM/YYYY')}</Text>
                    <Text style={styles.infos_text}>Note : {film.vote_average}/10</Text>
                    <Text style={styles.infos_text}>Nombre de votes : {film.vote_count}</Text>
                    <Text style={styles.infos_text}>Budget : {numeral(film.budget).format('0,0[.]00 $')}</Text>
                    <Text style={styles.infos_text}>Genre(s) : {film.genres.map(genre => genre.name).join('/')}</Text>
                    <Text style={styles.infos_text}>Companie(s) : {film.production_companies.map(company => company.name).join('/')}</Text>
                    <Modal visible={this.state.showImageView} transparent={false}>
                        <ImageZoom cropWidth={Dimensions.get('window').width}
                            cropHeight={Dimensions.get('window').height}
                            imageWidth={Dimensions.get('screen').width}
                            imageHeight={this.state.imagePosterSize.height}
                            >
                            <Image style={{width: Dimensions.get('screen').width, height: this.state.imagePosterSize.height}}
                                source={{uri:this.state.imagePosterUrl}}/>
                        </ImageZoom>
                    </Modal>
                </ScrollView>
            )
        }
    }

    _displayFavoriteImage() {
        let sourceImage

        sourceImage = !!this.props.favoriteFilms.find(film => film.id === this.state.film.id) 
            ? require('../Images/ic_favorite.png')
            : require('../Images/ic_favorite_border.png')

        return (
            <Image 
                style={styles.favorite_image}
                source={sourceImage}
            />
        )
    }

    _toggleFavorite() {
        const action = { type: 'TOGGLE_FAVORITE', value: this.state.film }
        this.props.dispatch(action)
    }

    render() {
        return (
            <View style={styles.main_container}>
                {this._displayLoading()}
                {this._displayFilm()}
            </View>
        )

    }

    componentDidMount() {
        getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
            const imagePosterUrl = getImageFromApi(data.poster_path)
            Image.getSize(imagePosterUrl, (width, height) => {
                this.setState({
                    film: data,
                    isLoading: false,
                    imagePosterUrl,
                    imagePosterSize: {
                        width,
                        height
                    }
                })
            })
        })
    }

}

const styles = StyleSheet.create({
    main_container: {
        flex: 1
    },
    loading_container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollView_container: {
        flex: 1
    },
    image: {
        height: 169,
        margin: 5
    },
    title_text: {
        fontWeight: 'bold',
        fontSize: 35,
        flex: 1,
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        color: '#000000',
        textAlign: 'center'
    },
    favorite_container: {
        alignItems: 'center'
    },
    favorite_image: {
        width: 40,
        height: 40
    },
    overview_text: {
        fontStyle: 'italic',
        color: '#666666',
        margin: 5,
        marginBottom: 15
    },
    infos_text: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
    }
})

const mapStateToProps = (state) => {
    return {
        favoriteFilms: state.favoriteFilms
    }
}

export default connect(mapStateToProps)(FilmDetail)
