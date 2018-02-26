const initialState = { favoriteFilms: [] }

function toggleFavorite(state = initialState, action) {
    let nextState

    switch (action.type) {
        case 'TOGGLE_FAVORITE':
            const isAlreadyAFavoriteFilm = !!state.favoriteFilms.find(film => film.id === action.value.id);
            if (!!isAlreadyAFavoriteFilm) {
                nextState = {
                    ...state,
                    favoriteFilms: state.favoriteFilms.filter(film => film.id !== action.value.id)
                }
            } else {
                nextState = {
                    ...state,
                    favoriteFilms: [...state.favoriteFilms, action.value]
                }
            }
            return nextState || state

        default:
            return state
    }
}

export default toggleFavorite