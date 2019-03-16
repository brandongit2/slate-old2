import {actionTypes} from '../constants';

const initialState = [];

export default function coursesReducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.GET_COURSES:
            return action.courses.data;
        case actionTypes.GET_CHILDREN:
            if ((action.want == null && action.parentType === 'subject') || action.want === 'courses') {
                return action.children.data;
            } else {
                return state;
            }
        default:
            return state;
    }
}
