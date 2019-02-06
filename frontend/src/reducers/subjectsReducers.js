import {actionTypes} from '../constants';

const initialState = [];

export default function subjectsReducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.GET_COURSES:
            return action.subjects.data;
        default:
            return state;
    }
}
