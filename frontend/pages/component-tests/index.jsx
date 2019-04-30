import React from 'react';
import {withRouter} from 'next/router';

import ButtonTest from './tests/buttons';
import BreadcrumbTest from './tests/breadcrumbs';
import ColorPickerTest from './tests/color-picker';
import ContentContainerTest from './tests/content-container';
import DropdownTest from './tests/dropdowns';
import LoadingSpinnerTest from './tests/loading-spinner';
import ModalTest from './tests/modals';
import NotificationTest from './tests/notifications';
import PanelTest from './tests/panels';
import SimpleBarTest from './tests/simplebar';
import SplitPaneTest from './tests/split-pane';
import TextEditorTest from './tests/text-editor';
import {Layout, SplitPane} from '../../components';

import css from './index.scss';

// The keys in this object are in this style for use as URLs.
const tests = {
    buttons:             ButtonTest,
    breadcrumbs:         BreadcrumbTest,
    'color-picker':      ColorPickerTest,
    'content-container': ContentContainerTest,
    dropdowns:           DropdownTest,
    'loading-spinner':   LoadingSpinnerTest,
    modals:              ModalTest,
    notifications:       NotificationTest,
    panels:              PanelTest,
    simplebar:           SimpleBarTest,
    'split-pane':        SplitPaneTest,
    'text-editor':       TextEditorTest
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
