import React from 'react';

import {NotificationsContext} from '../contexts';

import css from './Snackbar.scss';

export default function Snackbar() {
    const {notifications, removeNotification} = React.useContext(NotificationsContext);
    
    return (
        <div className={css.snackbar}>
            {Object.entries(notifications).map(([id, notification]) => (
                <div key={id} className={[
                    css.notification,
                    css[notification.level]
                ].join(' ')}>
                    <span>{notification.text}</span>
                    <i className="material-icons"
                       onClick={() => removeNotification(id)}>
                        close
                    </i>
                </div>
            ))}
        </div>
    );
}
