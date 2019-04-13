import {connect} from 'react-redux';

import {addNotification} from '../../actions';
import {severities} from '../../constants';

function NotificationTest(props) {
    return (
        <div>
            <button onClick={() => props.addNotification('test notification', severities.INFO, 5000)}>
                Add an info notification
            </button>
            <button onClick={() => props.addNotification('test notification', severities.WARN, 5000)}>
                Add a warn notification
            </button>
            <button onClick={() => props.addNotification('test notification', severities.ERROR, 5000)}>
                Add an error notification
            </button>
        </div>
    );
}

const actionCreators = {
    addNotification
};

export default connect(null, actionCreators)(NotificationTest);
