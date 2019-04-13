import React from 'react';

import ButtonTest from './buttons';
import ContentContainerTest from './content-container';
import DropdownTest from './dropdowns';
import ModalTest from './modals';
import NotificationTest from './notifications';
import PanelTest from './panels';
import {Layout} from '../../components';

import css from './index.scss';

// The keys in this object are in this style for use as URLs.
const tests = {
    buttons:             ButtonTest,
    'content-container': ContentContainerTest,
    dropdowns:           DropdownTest,
    modals:              ModalTest,
    notifications:       NotificationTest,
    panels:              PanelTest
};

export default function Testing(props) {
    const [currentPage, changePage] = React.useState(Object.keys(tests)[0]);
    
    React.useEffect(() => {
        const url = `/testing/${currentPage}`;
        const as = url;
        const options = {shallow: true};
        window.history.pushState({url, as, options}, null, url);
    });
    
    return (
        <Layout title="Test page - Slate" {...props}>
            <div className={css.testing}>
                <div className={css['test-list']}>
                    {Object.keys(tests).map(testName => (
                        <a key={testName}
                           onClick={() => changePage(testName)}
                           className={currentPage === testName ? css.current : ''}>
                            {testName.charAt(0).toUpperCase() + testName.replace('-', ' ').slice(1)}
                        </a>
                    ))}
                </div>
                <div className={css.test}>
                    {(() => {
                        const Test = tests[currentPage];
                        return <Test />;
                    })()}
                </div>
            </div>
        </Layout>
    );
}
