export const isDev = true; // CHANGE TO `false` BEFORE PUSHING TO PRODUCTION
export const rootUrl = 'http://localhost'; // CHANGE FOR PRODUCTION

export const actionTypes = {
    ADD_NOTIFICATION:    'add notification',
    HIDE_NOTIFICATION:   'hide notification',
    REMOVE_NOTIFICATION: 'remove notification',

    CHANGE_SUBJECT: 'change subject',
    CHANGE_COURSE:  'change course',
    CHANGE_UNIT:    'change unit',
    GET_SUBJECTS:   'get subjects',
    GET_COURSES:    'get courses',
    GET_UNITS:      'get units',
    GET_ARTICLES:   'get articles',

    SET_INFO: 'set info'
};

export const apiPrefix1 = '/api';
export const apiPrefix2 = rootUrl + '/api';

// These constants must be added to the backend `constants.js` as well.
export const errors = {
    ACCOUNT_EXISTS:         'account exists',
    BCRYPT_ERROR:           'bcrypt error',
    INVALID_FORM:           'invalid form',
    MYSQL_ERROR:            'mysql error',
    QUERY_EXPECTED:         'query expected',
    QUERY_NOT_IN_DATABASE:  'query not in database',
    RESEND_EMAIL_NOT_FOUND: 'resend email not found',
    UNKNOWN:                'unknown'
};

export const notificationLevels = {
    INFO:  'info',
    WARN:  'warn',
    ERROR: 'error'
};
