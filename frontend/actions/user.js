import axios from 'axios';

import {actionTypes} from '../constants';

import {verboseErrors} from '../config.json';

export function authenticate() {
    return async dispatch => {
        try {
            const user = (await axios.post('/api/authenticate')).data;
            if (user.success) {
                dispatch({
                    type: actionTypes.AUTHENTICATE,
                    user: user.user
                });
            }
        } catch (err) {
            if (verboseErrors) console.error(err);
            console.trace();
        }
    };
}
