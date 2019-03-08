import {actionTypes} from '../constants';

export * from './api';
export * from './snackbar';
export * from './user';

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

export function showModal(title, content, buttons, hasX = true) {
    return {
        type: actionTypes.SHOW_MODAL,
        title, content, buttons, hasX
    };
}

export function hideModal() {
    return {
        type: actionTypes.HIDE_MODAL
    };
}

export function toggleTheme() {
    return {
        type: actionTypes.TOGGLE_THEME
    };
}
