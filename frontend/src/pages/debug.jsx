import axios from 'axios';
import {connect} from 'react-redux';

import {addNotification} from '../actions';
import {Layout} from '../components';
import {apiPrefix1, apiPrefix2, notificationLevels} from '../constants';

const Debug = props => (
    <Layout>
        <style jsx>{`
            button {
                margin: 0.4em;
            }
        `}</style>

        <div style={{flexGrow: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <h1>Notifications</h1>
                <button onClick={() => props.addNotification('test notification', notificationLevels.INFO, 2000)}>Add an info notification</button>
                <button onClick={() => props.addNotification('test notification', notificationLevels.WARN, 2000)}>Add a warn notification</button>
                <button onClick={() => props.addNotification('test notification', notificationLevels.ERROR, 2000)}>Add an error notification</button>
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <h1>E-mail</h1>
                <button onClick={() => axios.post((process.env ? apiPrefix2 : apiPrefix1) + '/resend-verification-email', {
                    firstName: 'this isn\'t working',
                    email:     'no@not.working'
                })}>Send an e-mail</button>
            </div>
        </div>
    </Layout>
);

const mapDispatchToProps = dispatch => ({
    addNotification: (notification, level, timeout) => dispatch(addNotification(notification, level, timeout))
});

export default connect(null, mapDispatchToProps)(Debug);
