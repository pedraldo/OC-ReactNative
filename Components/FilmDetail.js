import React from 'react'
import numeral from 'numeral'
import moment from 'moment'
import Swiper from 'react-native-swiper'
import Icon from 'react-native-vector-icons/Ionicons'
import { StyleSheet, View, Text, Image, ActivityIndicator, ScrollView, TouchableOpacity, Modal, Button, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import { getFilmDetailFromApi, getImageFromApi } from '../API/TMDBApi'

class FilmDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            film: undefined,
            isLoading: true,
            filmPosterUri: '',
            showImageModal: false
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
                    {/* WARNING : StatusBar doesn't seem to dissmiss when modal is opened ONLY ON ANDROID DEVICES */}
                    <StatusBar hidden={this.state.showImageModal}/>
                    <TouchableOpacity
                        onPress={() => this.setState({showImageModal: true})}>
                        <Image
                            style={styles.image}
                            source={{ uri: this.state.filmPosterUri }}
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
                    <Modal visible={this.state.showImageModal} transparent={false} presentationStyle={'overFullScreen'}>
                        {/* <View style={[styles.modal_header_footer_swipe, styles.modal_header_swipe]}> */}
                            <View style={styles.modal_close_btn_container}>
                                <TouchableOpacity
                                    onPress={() => this.setState({showImageModal: false})}>
                                    <Icon name={'ios-close'} size={40} color={'white'}/>
                                </TouchableOpacity>
                            </View>
                        {/* </View> */}
                        <Swiper style={styles.modal_swipe}>
                            <View style={styles.modal_swipe_view}>
                                <Image
                                    style={styles.modal_swipe_view_image}
                                    source={{ uri: this.state.filmPosterUri }}
                                />
                            </View>
                        </Swiper>
                        {/* <View style={styles.modal_header_footer_swipe}>

                        </View> */}
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
            this.setState({
                film: data,
                isLoading: false,
                filmPosterUri: getImageFromApi(data.poster_path)
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
    },
    modal_header_swipe: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    modal_close_btn_container: {
        position: 'absolute',
        left: 15,
        top: 10,
        zIndex: 1,
    },
    modal_close_btn_text: {
        backgroundColor: 'white',
        color: 'black',
        width: 200,
        height: 40
    },
    modal_header_footer_swipe: {
        flex: 1,
        backgroundColor: 'black'
    },
    modal_swipe: {
        flex: 10
    },
    modal_swipe_view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    modal_swipe_view_image: {
        flex: 1,
        width: '100%',
        height: 'auto'
    }
})

const mapStateToProps = (state) => {
    return {
        favoriteFilms: state.favoriteFilms
    }
}

export default connect(mapStateToProps)(FilmDetail)
