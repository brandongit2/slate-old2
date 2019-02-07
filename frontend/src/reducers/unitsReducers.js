import {actionTypes} from '../constants';

const initialState = [];

export default function unitsReducers(state = initialState, action) {
    switch (action.type) {
        case actionTypes.GET_UNITS:
            return action.units.data;
        default:
            return state;
    }
}
