import axios from 'axios';

import {actionTypes} from '../constants';

export * from './data';
export * from './snackbar';
export * from './user';

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
    axios.post('/api/settings/toggle-theme');
    return {
        type: actionTypes.TOGGLE_THEME
    };
}
