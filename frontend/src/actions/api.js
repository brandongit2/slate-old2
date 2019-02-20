import axios from 'axios';

import {actionTypes, apiPrefix1, apiPrefix2} from '../constants';

const apiPrefix = process.env ? apiPrefix2 : apiPrefix1;

export function getChildren(parentType, parentId) {
    return async dispatch => {
        dispatch({
            type:     actionTypes.GET_CHILDREN,
            children: await axios.get(`${apiPrefix}/children?${parentType}=${parentId}`),
            parentType
        });
    };
}

export function getAllSubjects() {
    return async dispatch => {
        dispatch({
            type:     actionTypes.GET_SUBJECTS,
            subjects: await axios.get(apiPrefix + '/allSubjects')
        });
    };
}

export function getSubject(subjectId) {
    return async dispatch => {
        dispatch({
            type:     actionTypes.GET_SUBJECTS,
            subjects: await axios.get(apiPrefix + '/subject/' + subjectId)
        });
    };
}

export function getAllCourses() {
    return async dispatch => {
        dispatch({
            type:    actionTypes.GET_COURSES,
            courses: await axios.get(apiPrefix + '/allCourses')
        });
    };
}

export function getCourse(courseId) {
    return async dispatch => {
        dispatch({
            type:    actionTypes.GET_COURSES,
            courses: await axios.get(apiPrefix + '/course/' + courseId)
        });
    };
}

export function getAllUnits() {
    return async dispatch => {
        dispatch({
            type:  actionTypes.GET_UNITS,
            units: await axios.get(apiPrefix + '/allUnits')
        });
    };
}

export function getUnit(unitId) {
    return async dispatch => {
        dispatch({
            type:  actionTypes.GET_UNITS,
            units: await axios.get(apiPrefix + '/unit/' + unitId)
        });
    };
}

export function getArticle(articleId) {
    return async dispatch => {
        dispatch({
            type:     actionTypes.GET_ARTICLES,
            articles: await axios.get(apiPrefix + '/article/' + articleId)
        });
    };
}
