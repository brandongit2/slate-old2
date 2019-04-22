import React from 'react';

import {severities} from '../../../constants';
import {NotificationsContext} from '../../../contexts';

import css from './notifications.scss';

export default function NotificationTest() {
    const {addNotification} = React.useContext(NotificationsContext);
    
    return (
        <div className={css['notification-test']}>
            <button className="low"
                    onClick={() => addNotification('test notification')}>
                Add an info notification
            </button>
            <button className="med"
                    onClick={() => addNotification('test notification', severities.WARN)}>
                Add a warn notification
            </button>
            <button className="high"
                    onClick={() => addNotification('test notification', severities.ERROR)}>
                Add an error notification
            </button>
        </div>
    );
}
