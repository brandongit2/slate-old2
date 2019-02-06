import axios from 'axios';

import {actionTypes} from '../constants';

const apiPrefix = '/api';

export const getCourses = () => async dispatch => {
    let subjects = await axios.get(apiPrefix + '/subjects');
    let courses = await axios.get(apiPrefix + '/courses');

    dispatch({
        type: actionTypes.GET_COURSES,
        subjects, courses
    });
};
