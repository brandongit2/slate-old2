import {connect} from 'react-redux';

import {addNotification} from '../actions';
import {Dropdown, Item, Layout} from '../components';
import {notificationLevels} from '../constants';
import css from './debug.scss';

function Debug(props) {
    return (
        <Layout>
            <div id={css.container}>
                <div>
                    <h1>Notifications</h1>
                    <button onClick={() => props.addNotification('test notification', notificationLevels.INFO, 2000)}>
                        Add an info notification
                    </button>
                    <button onClick={() => props.addNotification('test notification', notificationLevels.WARN, 2000)}>
                        Add a warn notification
                    </button>
                    <button onClick={() => props.addNotification('test notification', notificationLevels.ERROR, 2000)}>
                        Add an error notification
                    </button>
                </div>
                <div>
                    <h1>Dropdown test</h1>
                    <Dropdown label="Select an item...">
                        <Item>Item #1</Item>
                        <Item>Item #2</Item>
                        <Item>Item #3</Item>
                        <Item>Item #4</Item>
                        <Item>Loooooooooooooooooooooooooooooooong list item</Item>
                        <Item>Item #6</Item>
                        <Item>Item #7</Item>
                        <Item>Item #8</Item>
                        <Item>Item #9</Item>
                        <Item>Item #10</Item>
                        <Item>Item #11</Item>
                        <Item>Item #12</Item>
                        <Item>Item #13</Item>
                    </Dropdown>
                    <Dropdown mini label="Mini dropdown">
                        <Item>Item #1</Item>
                        <Item>Item #2</Item>
                        <Item>Item #3</Item>
                        <Item>Item #4</Item>
                        <Item>Loooooooooooooooooooooooooooooooong list item</Item>
                        <Item>Item #6</Item>
                        <Item>Item #7</Item>
                        <Item>Item #8</Item>
                        <Item>Item #9</Item>
                        <Item>Item #10</Item>
                        <Item>Item #11</Item>
                        <Item>Item #12</Item>
                        <Item>Item #13</Item>
                    </Dropdown>
                </div>
            </div>
        </Layout>
    );
}

function mapDispatchToProps(dispatch) {
    return {
        addNotification: (notification, level, timeout) => dispatch(addNotification(notification, level, timeout))
    };
}

export default connect(null, mapDispatchToProps)(Debug);
