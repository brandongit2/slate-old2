import {generate} from 'shortid';

import {actionTypes, notificationLevels} from '../constants';

// `timeout` is in milliseconds.
export const addNotification = (notification, level = notificationLevels.INFO, timeout = 7000) => dispatch => {
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

export const removeNotification = id => dispatch => {
    dispatch({
        type: actionTypes.HIDE_NOTIFICATION,
        id
    });

    setTimeout(() => dispatch({
        type: actionTypes.REMOVE_NOTIFICATION,
        id
    }), 500);
};
