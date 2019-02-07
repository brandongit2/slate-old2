import axios from 'axios';

import {actionTypes} from '../constants';

const apiPrefix1 = '/api';
const apiPrefix2 = 'http://localhost:8080/api';

export const getCourses = () => async dispatch => {
    const apiPrefix = process.env ? apiPrefix2 : apiPrefix1;
    const subjects = await axios.get(apiPrefix + '/subjects');
    const courses = await axios.get(apiPrefix + '/courses');

    dispatch({
        type: actionTypes.GET_COURSES,
        subjects, courses
    });
};

export const getCoursesBySubject = subjectId => async dispatch => {
    const apiPrefix = process.env ? apiPrefix2 : apiPrefix1;
    const courses = await axios.get(apiPrefix + '/courses?subject=' + subjectId);

    dispatch({
        type: actionTypes.GET_COURSES_BY_SUBJECT,
        courses
    });
};

export const getArticlesByCourse = courseId => async dispatch => {
    const apiPrefix = process.env ? apiPrefix2 : apiPrefix1;
    const units = await axios.get(apiPrefix + '/units?course=' + courseId);
    const articles = await axios.get(apiPrefix + '/articles?course=' + courseId);

    dispatch({
        type: actionTypes.GET_ARTICLES_BY_COURSE,
        units, articles
    });
};
