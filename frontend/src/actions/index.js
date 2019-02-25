import {actionTypes} from '../constants';

export * from './api';
export * from './snackbar';

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

export function setInfo(info) {
    return {
        type: actionTypes.SET_INFO,
        info
    };
}
