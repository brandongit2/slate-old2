import axios from 'axios';

import {actionTypes, apiPrefix1, apiPrefix2} from '../constants';

export const getAllSubjects = () => async dispatch => {
    const apiPrefix = process.env ? apiPrefix2 : apiPrefix1;
    const subjects = await axios.get(apiPrefix + '/subjects');

    dispatch({
        type: actionTypes.GET_SUBJECTS,
        subjects
    });
};

export const getSubject = subjectId => async dispatch => {
    const apiPrefix = process.env ? apiPrefix2 : apiPrefix1;
    const subjects = await axios.get(apiPrefix + '/subjects/' + subjectId);

    dispatch({
        type: actionTypes.GET_SUBJECTS,
        subjects
    });
};

export const getAllCourses = () => async dispatch => {
    const apiPrefix = process.env ? apiPrefix2 : apiPrefix1;
    const courses = await axios.get(apiPrefix + '/courses');

    dispatch({
        type: actionTypes.GET_COURSES,
        courses
    });
};

export const getCourse = courseId => async dispatch => {
    const apiPrefix = process.env ? apiPrefix2 : apiPrefix1;
    const courses = await axios.get(apiPrefix + '/courses/' + courseId);

    dispatch({
        type: actionTypes.GET_COURSES,
        courses
    });
};

export const getCoursesBySubject = subjectId => async dispatch => {
    const apiPrefix = process.env ? apiPrefix2 : apiPrefix1;
    const courses = await axios.get(apiPrefix + '/courses?subject=' + subjectId);

    dispatch({
        type: actionTypes.GET_COURSES, // This is the same as `getAllCourses` but with a narrower selection of courses.
        courses
    });
};

export const getAllUnits = () => async dispatch => {
    const apiPrefix = process.env ? apiPrefix2 : apiPrefix1;
    const units = await axios.get(apiPrefix + '/units');

    dispatch({
        type: actionTypes.GET_UNITS,
        units
    });
};

export const getUnitsBySubject = subjectId => async dispatch => {
    const apiPrefix = process.env ? apiPrefix2 : apiPrefix1;
    const units = await axios.get(apiPrefix + '/units?subject=' + subjectId);

    dispatch({
        type: actionTypes.GET_UNITS, // This is the same as `getAllUnits` but with a narrower selection of units.
        units
    });
};

export const getUnitsByCourse = courseId => async dispatch => {
    const apiPrefix = process.env ? apiPrefix2 : apiPrefix1;
    const units = await axios.get(apiPrefix + '/units?course=' + courseId);

    dispatch({
        type: actionTypes.GET_UNITS, // This is the same as `getAllUnits` but with a narrower selection of units.
        units
    });
};

export const getArticlesByCourse = courseId => async dispatch => {
    const apiPrefix = process.env ? apiPrefix2 : apiPrefix1;
    const articles = await axios.get(apiPrefix + '/articles?course=' + courseId);

    dispatch({
        type: actionTypes.GET_ARTICLES, // This is the same as `getAllArticles` but with a narrower selection of units.
        articles
    });
};
