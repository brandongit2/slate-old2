import axios from 'axios';

import {actionTypes} from '../constants';

const apiPrefix1 = '/api';
const apiPrefix2 = 'http://localhost:8080/api';

export const getCourses = () => async dispatch => {
    let subjects, courses;
    if (!process.env) {
        subjects = await axios.get(apiPrefix1 + '/subjects');
        courses = await axios.get(apiPrefix1 + '/courses');
    } else {
        subjects = await axios.get(apiPrefix2 + '/subjects');
        courses = await axios.get(apiPrefix2 + '/courses');
    }

    dispatch({
        type: actionTypes.GET_COURSES,
        subjects, courses
    });
};

export const getArticlesByCourse = courseId => async dispatch => {
    let units, articles;
    if (!process.env) {
        units = await axios.get(apiPrefix1 + '/units?course=' + courseId);
        articles = await axios.get(apiPrefix1 + '/articles?course=' + courseId);
    } else {
        units = await axios.get(apiPrefix2 + '/units?course=' + courseId);
        articles = await axios.get(apiPrefix2 + '/articles?course=' + courseId);
    }

    dispatch({
        type: actionTypes.GET_ARTICLES_BY_COURSE,
        units, articles
    });
};
