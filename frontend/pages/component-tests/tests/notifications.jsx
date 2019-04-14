import {connect} from 'react-redux';

import {addNotification} from '../../../actions';
import {severities} from '../../../constants';

import css from './notifications.scss';

function NotificationTest(props) {
    return (
        <div className={css['notification-test']}>
            <button className="low"
                    onClick={() => props.addNotification('test notification', severities.INFO, 50000)}>
                Add an info notification
            </button>
            <button className="med"
                    onClick={() => props.addNotification('test notification', severities.WARN, 5000)}>
                Add a warn notification
            </button>
            <button className="high"
                    onClick={() => props.addNotification('test notification', severities.ERROR, 5000)}>
                Add an error notification
            </button>
        </div>
    );
}

const actionCreators = {
    addNotification
};

export default connect(null, actionCreators)(NotificationTest);
