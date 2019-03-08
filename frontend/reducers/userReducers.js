import {actionTypes} from '../constants';

const initialState = {
    isLoggedIn: false
};

export default function userReducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.AUTHENTICATE:
            return {
                isLoggedIn: true,
                ...action.user
            };
        default:
            return state;
    }
}
