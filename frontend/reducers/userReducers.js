import {actionTypes} from '../constants';

const initialState = {
    isLoggedIn: false,
    theme:      'light'
};

export default function userReducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.AUTHENTICATE:
            return {
                isLoggedIn: true,
                ...action.user
            };
        case actionTypes.TOGGLE_THEME:
            return {
                ...state,
                theme: state.theme === 'light' ? 'dark' : 'light'
            };
        default:
            return state;
    }
}
