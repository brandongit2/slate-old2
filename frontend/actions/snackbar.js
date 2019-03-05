import {generate} from 'shortid';

import {actionTypes, severities} from '../constants';

// `timeout` is in milliseconds.
export function addNotification(notification, level = severities.INFO, timeout = 7000) {
    return dispatch => {
        const id = generate();
        
        setTimeout(() => {
            dispatch({
                type: actionTypes.HIDE_NOTIFICATION,
                id
            });

            setTimeout(() => dispatch({
                type: actionTypes.REMOVE_NOTIFICATION,
                id
            }), 500);
        }, timeout);

        return dispatch({
            type: actionTypes.ADD_NOTIFICATION,
            id, notification, level, timeout
        });
    };
}

export function removeNotification(id) {
    return dispatch => {
        dispatch({
            type: actionTypes.HIDE_NOTIFICATION,
            id
        });
        
        setTimeout(() => dispatch({
            type: actionTypes.REMOVE_NOTIFICATION,
            id
        }), 500);
    };
}
