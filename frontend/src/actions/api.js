import axios from 'axios';

import {actionTypes} from '../constants';

export function getChildren(parentType, parentId) {
    return async dispatch => {
        dispatch({
            type:     actionTypes.GET_CHILDREN,
            children: await axios.get(`/api/children?${parentType}=${parentId}`),
            parentType
        });
    };
}

export function getAllSubjects() {
    return async dispatch => {
        dispatch({
            type:     actionTypes.GET_SUBJECTS,
            subjects: await axios.get('/api/allSubjects')
        });
    };
}

export function getSubject(subjectId) {
    return async dispatch => {
        dispatch({
            type:     actionTypes.GET_SUBJECTS,
            subjects: await axios.get('/api/subject/' + subjectId)
        });
    };
}

export function getAllCourses() {
    return async dispatch => {
        dispatch({
            type:    actionTypes.GET_COURSES,
            courses: await axios.get('/api/allCourses')
        });
    };
}

export function getCourse(courseId) {
    return async dispatch => {
        dispatch({
            type:    actionTypes.GET_COURSES,
            courses: await axios.get('/api/course/' + courseId)
        });
    };
}

export function getAllUnits() {
    return async dispatch => {
        dispatch({
            type:  actionTypes.GET_UNITS,
            units: await axios.get('/api/allUnits')
        });
    };
}

export function getUnit(unitId) {
    return async dispatch => {
        dispatch({
            type:  actionTypes.GET_UNITS,
            units: await axios.get('/api/unit/' + unitId)
        });
    };
}

export function getArticle(articleId) {
    return async dispatch => {
        dispatch({
            type:     actionTypes.GET_ARTICLES,
            articles: await axios.get('/api/article/' + articleId)
        });
    };
}
