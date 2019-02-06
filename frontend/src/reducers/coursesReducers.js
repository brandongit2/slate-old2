import {actionTypes} from '../constants';

const initialState = [];

export default function coursesReducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.GET_COURSES:
            return action.courses.data;
        default:
            return state;
    }
}
