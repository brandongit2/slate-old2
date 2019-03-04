import {actionTypes} from '../constants';

const initialState = [];

export default function articlesReducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.GET_ARTICLES:
            return action.articles.data;
        case actionTypes.GET_CHILDREN:
            if (action.parentType === 'unit') {
                return action.children.data;
            } else {
                return state;
            }
        default:
            return state;
    }
}
