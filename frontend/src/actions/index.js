import {actionTypes} from '../constants';

export * from './api';

export const changeSubject = newSubject => ({
    type: actionTypes.CHANGE_SUBJECT,
    newSubject
});

export const changeCourse = newCourse => ({
    type: actionTypes.CHANGE_COURSE,
    newCourse
});
