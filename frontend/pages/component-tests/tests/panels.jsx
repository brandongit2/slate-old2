import React from 'react';

import {Panel} from '../../../components';

import css from './panels.scss';

export default function PanelTest() {
    return (
        <div className={css['panel-test']}>
            <Panel visible={(togglePanel, isOpen) => (
                       /* eslint-disable-next-line react/jsx-indent */
                       <button onClick={togglePanel}>Click to {isOpen ? 'close' : 'open'}</button>
                   )}
                   hidden={() => (
                       <div className={css['panel-hidden']}>
                           <p>hello</p>
                       </div>
                   )} />
        </div>
    );
}
