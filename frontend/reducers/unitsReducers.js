import {actionTypes} from '../constants';

const initialState = [];

export default function unitsReducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.GET_UNITS:
            return action.units.data;
        case actionTypes.GET_CHILDREN:
            if (action.parentType === 'course') {
                return action.children.data;
            } else {
                return state;
            }
        default:
            return state;
    }
}
