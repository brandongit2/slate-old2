import axios from 'axios';

import {actionTypes} from '../constants';

const apiPrefix = '/api';

export const getCourses = () => dispatch => {
    axios.get(apiPrefix + '/courses')
        .then(res => dispatch({
            type: actionTypes.GET_COURSES,
            data: res.data
        }))
        .catch(err => console.log(err));
};
