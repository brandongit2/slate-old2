import {combineReducers, compose, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import {courses} from './reducers';

const store = createStore(
    combineReducers({
        courses
    }),
    typeof window !== 'undefined'
        ? window.__REDUX_DEVTOOLS_EXTENSION__
            ? compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__())
            : applyMiddleware(thunk)
        : undefined
);

export default store;
