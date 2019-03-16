import {actionTypes} from '../constants';

const initialState = [];

export default function articlesReducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.GET_ARTICLES:
            return action.articles.data;
        case actionTypes.GET_ARTICLE_CONTENT: {
            let newState = JSON.parse(JSON.stringify(state));
            for (let i = 0; i < newState.length; i++) {
                if (newState[i].id === action.content.data[0].id) {
                    newState[i].content = action.content.data[0].content;
                }
            }
            return newState;
        }
        case actionTypes.GET_CHILDREN:
            if ((action.want == null && action.parentType === 'unit') || action.want === 'articles') {
                return action.children.data;
            } else {
                return state;
            }
        default:
            return state;
    }
}
