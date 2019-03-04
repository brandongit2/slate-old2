export const isDev = true; // CHANGE TO `false` BEFORE PUSHING TO PRODUCTION
export const rootUrl = 'http://localhost'; // CHANGE FOR PRODUCTION

export const actionTypes = {
    ADD_NOTIFICATION:    'add notification',
    HIDE_NOTIFICATION:   'hide notification',
    REMOVE_NOTIFICATION: 'remove notification',
    
    SHOW_MODAL: 'show modal',
    HIDE_MODAL: 'hide modal',

    CHANGE_SUBJECT: 'change subject',
    CHANGE_COURSE:  'change course',
    CHANGE_UNIT:    'change unit',
    CHANGE_ARTICLE: 'change article',
    GET_CHILDREN:   'get children',
    GET_SUBJECTS:   'get subjects',
    GET_COURSES:    'get courses',
    GET_UNITS:      'get units',
    GET_ARTICLES:   'get articles',

    LOG_IN: 'log in',

    SET_INFO: 'set info'
};

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

export const severities = {
    INFO:  'info',
    WARN:  'warn',
    ERROR: 'error',
    
    LOW:  'low',
    MED:  'med',
    HIGH: 'high'
};
