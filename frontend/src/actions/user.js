import axios from 'axios';

import {actionTypes} from '../constants';

export function logIn() {
    return async dispatch => {
        const authToken = window.localStorage.getItem('authToken');
        if (authToken != null) {
            dispatch({
                type: actionTypes.LOG_IN,
                user: (await axios.get('/api/user?token=' + authToken)).data[0]
            });
        }
    };
}
