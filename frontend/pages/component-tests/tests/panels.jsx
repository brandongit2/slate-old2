import React from 'react';

import {Panel} from '../../../components';
import {Visible, Hidden} from '../../../components/Panel';

import css from './panels.scss';

export default function PanelTest() {
    const [panelIsOpen, togglePanel] = React.useReducer(isOpen => !isOpen, false);
    
    return (
        <div>
            <Panel isOpen={panelIsOpen}>
                <Visible>
                    <button onClick={togglePanel}>
                        Click to {panelIsOpen ? 'close' : 'open'}
                    </button>
                </Visible>
                <Hidden>
                    <div className={css['panel-hidden']}>
                        <p>hello</p>
                    </div>
                </Hidden>
            </Panel>
        </div>
    );
}
