import axios from 'axios';

import {actionTypes} from '../constants';

const apiPrefix1 = '/api';
const apiPrefix2 = 'http://localhost:8080/api';

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

export const getCoursesBySubject = subjectId => async dispatch => {
    const apiPrefix = process.env ? apiPrefix2 : apiPrefix1;
    const courses = await axios.get(apiPrefix + '/courses?subject=' + subjectId);

    dispatch({
        type: actionTypes.GET_COURSES, // This is the same as `getCourses` but with a narrower selection of courses.
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
        type: actionTypes.GET_UNITS, // This is the same as `getUnits` but with a narrower selection of units.
        units
    });
};