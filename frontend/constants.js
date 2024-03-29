export const actionTypes = {
    ADD_NOTIFICATION:    'add notification',
    HIDE_NOTIFICATION:   'hide notification',
    REMOVE_NOTIFICATION: 'remove notification',

    SHOW_MODAL: 'show modal',
    HIDE_MODAL: 'hide modal',

    CHANGE_SUBJECT:      'change subject',
    CHANGE_COURSE:       'change course',
    CHANGE_UNIT:         'change unit',
    CHANGE_ARTICLE:      'change article',
    GET_CHILDREN:        'get children',
    GET_SUBJECTS:        'get subjects',
    GET_COURSES:         'get courses',
    GET_UNITS:           'get units',
    GET_ARTICLES:        'get articles',
    GET_ARTICLE_CONTENT: 'get article content',

    AUTHENTICATE:  'authenticate',
    SET_USER_INFO: 'set user info',

    SET_INFO:     'set info',
    TOGGLE_THEME: 'toggle theme'
};

// These constants must be added to the backend `constants.js` as well.
export const errors = {
    ACCOUNT_EXISTS:         'account exists',
    INVALID_FORM:           'invalid form',
    INVALID_LOGIN:          'invalid login',
    QUERY_EXPECTED:         'query expected',
    QUERY_NOT_IN_DATABASE:  'query not in database',
    RESEND_EMAIL_NOT_FOUND: 'resend email not found',
    UNKNOWN:                'unknown',
    USER_NOT_FOUND:         'user not found'
};

export const severities = {
    INFO:  'info',
    WARN:  'warn',
    ERROR: 'error',

    LOW:  'low',
    MED:  'med',
    HIGH: 'high'
};
