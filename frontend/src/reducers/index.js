import {combineReducers} from 'redux';

import subjects from './subjectsReducers';
import courses from './coursesReducers';
import units from './unitsReducers';
import articles from './articlesReducers';
import * as snackbar from './snackbarReducers';
import {actionTypes} from '../constants';

export default combineReducers({
    subjects, courses, units, articles,
    notifications:        snackbar.notificationsReducers,
    visibleNotifications: snackbar.visibleNotificationsReducers,

    currentSubject: (state = null, action) => {
        if (action.type === actionTypes.CHANGE_SUBJECT) {
            return action.newSubject;
        } else {
            return state;
        }
    },
    currentCourse: (state = null, action) => {
        if (action.type === actionTypes.CHANGE_COURSE) {
            return action.newCourse;
        } else {
            return state;
        }
    },
    currentUnit: (state = null, action) => {
        if (action.type === actionTypes.CHANGE_UNIT) {
            return action.newUnit;
        } else {
            return state;
        }
    },
    currentArticle: (state = null, action) => {
        if (action.type === actionTypes.CHANGE_ARTICLE) {
            return action.newArticle;
        } else {
            return state;
        }
    },
    info: (state = {}, action) => {
        if (action.type === actionTypes.SET_INFO) {
            return action.info;
        } else {
            return state;
        }
    }
});
