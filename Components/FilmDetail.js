import React from 'react'
import numeral from 'numeral'
import moment from 'moment'
import { StyleSheet, View, Text, Image, ActivityIndicator, ScrollView } from 'react-native'
import { getFilmDetailFromApi, getImageFromApi } from '../API/TMDBApi'

class FilmDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = { 
            film: undefined,
            isLoading: true,
        }
    }

    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size="large"/>
                </View>
            )
        }
    }

    _displayFilm() {
        const { film } = this.state
        if (film !== undefined) {
            return (
                <ScrollView style={styles.scrollView_container}>
                    <Image
                        style={styles.image}
                        source={{ uri: getImageFromApi(film.poster_path) }}
                    />
                    <Text style={styles.title_text}>{film.title}</Text>
                    <Text style={styles.overview_text}>{film.overview}</Text>
                    <Text style={styles.infos_text}>Sorti le {moment(new Date(film.release_date)).format('DD/MM/YYYY')}</Text>
                    <Text style={styles.infos_text}>Note : {film.vote_average}/10</Text>
                    <Text style={styles.infos_text}>Nombre de votes : {film.vote_count}</Text>
                    <Text style={styles.infos_text}>Budget : {numeral(film.budget).format('0,0[.]00 $')}</Text>
                    <Text style={styles.infos_text}>Genre(s) : {film.genres.map(genre => genre.name).join('/')}</Text>
                    <Text style={styles.infos_text}>Companie(s) : {film.production_companies.map(company => company.name).join('/')}</Text>
                </ScrollView>
            )
        }
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
                isLoading: false
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

export default FilmDetail