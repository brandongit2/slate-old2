import axios from 'axios';

import {actionTypes} from '../constants';

export function logIn() {
    return async dispatch => {
        try {
            const user = (await axios.post('/api/log-in')).data;
            if (user.success) {
                dispatch({
                    type: actionTypes.LOG_IN,
                    user: user.user
                });
            }
        } catch (err) {
            console.error(err);
        }
    };
}