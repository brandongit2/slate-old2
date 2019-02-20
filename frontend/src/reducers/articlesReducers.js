import {actionTypes} from '../constants';

const initialState = [];

export default function articlesReducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.GET_ARTICLES:
            return [...state, ...action.articles.data];
        case actionTypes.GET_CHILDREN:
            if (action.parentType === 'unit') {
                return [...state, ...action.children.data];
            } else {
                return state;
            }
        default:
            return state;
    }
}
