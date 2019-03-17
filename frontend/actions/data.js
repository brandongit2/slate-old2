import axios from 'axios';

import {actionTypes} from '../constants';

export function getChildren(parentType, parentId, want) {
    return async dispatch => {
        dispatch({
            type:     actionTypes.GET_CHILDREN,
            children: await axios.get(`/api/children?${want ? `want=${want}&` : ''}${parentType}=${parentId}`),
            parentType, want
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

export function getArticleContent(articleId) {
    return async dispatch => {
        dispatch({
            type:    actionTypes.GET_ARTICLE_CONTENT,
            content: await axios.get('/api/article-content/' + articleId)
        });
    };
}

export function changeSubject(newSubject) {
    return {
        type: actionTypes.CHANGE_SUBJECT,
        newSubject
    };
}

export function changeCourse(newCourse) {
    return {
        type: actionTypes.CHANGE_COURSE,
        newCourse
    };
}

export function changeUnit(newUnit) {
    return {
        type: actionTypes.CHANGE_UNIT,
        newUnit
    };
}

export function changeArticle(newArticle) {
    return {
        type: actionTypes.CHANGE_ARTICLE,
        newArticle
    };
}
