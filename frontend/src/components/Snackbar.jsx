import {connect} from 'react-redux';

import {removeNotification} from '../actions';
import {notificationLevels} from '../constants';
import css from './Snackbar.scss';

const levelToCssClass = {
    [notificationLevels.INFO]:  css.info,
    [notificationLevels.WARN]:  css.warn,
    [notificationLevels.ERROR]: css.error
};

const Snackbar = props => (
    <div id={css.snackbar}>{
        Object.entries(props.notifications).map(([id, notification]) => (
            <div key={id} className={
                css.notification + ' ' +
                (props.visibleNotifications.indexOf(id) === -1 ? css.fade : '') + ' ' +
                levelToCssClass[notification.level]}>

                <span>{notification.text}</span>
                <i className="material-icons" onClick={() => props.removeNotification(id)}>close</i>
            </div>
        ))
    }</div>
);

const mapStateToProps = state => ({
    notifications:        state.notifications,
    visibleNotifications: state.visibleNotifications
});

const mapDispatchToProps = dispatch => ({
    removeNotification: id => dispatch(removeNotification(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Snackbar);
