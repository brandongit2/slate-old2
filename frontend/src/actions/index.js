import axios from 'axios';

import {actionTypes} from '../constants';

const apiPrefix1 = '/api';
const apiPrefix2 = 'http://localhost:3001/api'; // For local dev environment (SSR)

export const getCourses = () => async dispatch => {
    let subjects, courses;
    try {
        subjects = await axios.get(apiPrefix1 + '/subjects');
        courses = await axios.get(apiPrefix1 + '/courses');
    } catch {
        subjects = await axios.get(apiPrefix2 + '/subjects');
        courses = await axios.get(apiPrefix2 + '/courses');
    }

    dispatch({
        type: actionTypes.GET_COURSES,
        subjects, courses
    });
};
