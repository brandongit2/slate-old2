import {combineReducers} from 'redux';

import subjects from './subjectsReducers';
import courses from './coursesReducers';
import units from './unitsReducers';
import articles from './articlesReducers';
import {actionTypes} from '../constants';

export default combineReducers({
    subjects, courses, units, articles,
    currentSubject: (state = null, action) => {
        if (action.type === actionTypes.CHANGE_SUBJECT) {
            return action.newSubject;
        }
        return state;
    },
    currentCourse: (state = null, action) => {
        if (action.type === actionTypes.CHANGE_COURSE) {
            return action.newCourse;
        }
        return state;
    },
    currentCourses: (state = null, action) => {
        if (action.type === actionTypes.GET_COURSES_BY_SUBJECT) {
            return action.courses.data;
        }
        return state;
    }
});
