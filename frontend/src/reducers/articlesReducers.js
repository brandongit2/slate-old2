import {actionTypes} from '../constants';

const initialState = [];

export default function articlesReducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.GET_ARTICLES:
            return action.articles.data;
        default:
            return state;
    }
}
