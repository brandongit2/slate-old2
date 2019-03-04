import {actionTypes} from '../constants';

const notifications_initialState = {};

export function notificationsReducers(state = notifications_initialState, action) {
    switch (action.type) {
        case actionTypes.ADD_NOTIFICATION:
            return {
                ...state,
                [action.id]: {
                    text:    action.notification,
                    level:   action.level,
                    timeout: action.timeout,
                    fade:    false // Fade animation
                }
            };
        case actionTypes.REMOVE_NOTIFICATION: {
            let newList = JSON.parse(JSON.stringify(state));
            delete newList[action.id];
            return newList;
        }
        default:
            return state;
    }
}

const visibleNotifications_initialState = [];

export function visibleNotificationsReducers(state = visibleNotifications_initialState, action) {
    switch (action.type) {
        case actionTypes.ADD_NOTIFICATION:
            return [...state, action.id];
        case actionTypes.HIDE_NOTIFICATION:
            return state.filter(notification => notification !== action.id);
        default:
            return state;
    }
}
