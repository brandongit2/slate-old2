import React from 'react';
import {withRouter} from 'next/router';

import ButtonTest from './tests/buttons';
import ColorPickerTest from './tests/color-picker';
import ContentContainerTest from './tests/content-container';
import DropdownTest from './tests/dropdowns';
import ModalTest from './tests/modals';
import NotificationTest from './tests/notifications';
import PanelTest from './tests/panels';
import SplitPaneTest from './tests/split-pane';
import {Layout, SplitPane} from '../../components';

import css from './index.scss';

// The keys in this object are in this style for use as URLs.
const tests = {
    buttons:             ButtonTest,
    'color-picker':      ColorPickerTest,
    'content-container': ContentContainerTest,
    dropdowns:           DropdownTest,
    modals:              ModalTest,
    notifications:       NotificationTest,
    panels:              PanelTest,
    'split-pane':        SplitPaneTest
};

function Testing(props) {
    const [currentTest, changeTest] = React.useState(props.router.query.test ? props.router.query.test : Object.keys(tests)[0]);
    
    React.useEffect(() => {
        const url = `/component-tests?test=${currentTest}`;
        window.history.replaceState(window.history.state, null, url);
    });
    
    return (
        <Layout title="Test page - Slate">
            <div className={css.testing}>
                <SplitPane initialFirstPaneSize={256} minPaneSize={170}>
                    <div className={css['test-list']}>
                        {Object.keys(tests).map(testName => (
                            <a key={testName}
                               onClick={() => changeTest(testName)}
                               className={currentTest === testName ? css.current : ''}>
                                {testName.charAt(0).toUpperCase() + testName.replace('-', ' ').slice(1)}
                            </a>
                        ))}
                    </div>
                    <div className={css.test}>
                        {(() => {
                            const Test = tests[currentTest];
                            return <Test />;
                        })()}
                    </div>
                </SplitPane>
            </div>
        </Layout>
    );
}

export default withRouter(Testing);
