import {actionTypes} from '../constants';

export * from './api';
export * from './snackbar';

export const changeSubject = newSubject => ({
    type: actionTypes.CHANGE_SUBJECT,
    newSubject
});

export const changeCourse = newCourse => ({
    type: actionTypes.CHANGE_COURSE,
    newCourse
});

export const setInfo = info => ({
    type: actionTypes.SET_INFO,
    info
});
