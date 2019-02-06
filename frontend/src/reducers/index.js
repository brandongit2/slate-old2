import {combineReducers} from 'redux';

import courses from './coursesReducers';
import subjects from './subjectsReducers';

export default combineReducers({
    courses, subjects
});
