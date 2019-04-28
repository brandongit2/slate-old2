import React from 'react';

import {default as Panel, Visible, Hidden} from '../../Panel';

import css from './ColorPicker.scss';

export default function ColorPicker(props) {
    const [panelIsOpen, togglePanel] = React.useReducer(isOpen => !isOpen, false);
    const [color, setColor] = React.useState(props.initialColor);
    
    return (
        <div className={css['color-picker']}>
            <Panel isOpen={panelIsOpen}>
                <Visible>
                    <div className={css.visible} onClick={togglePanel}>
                        <div className={css.preview} style={{background: `#${color}`}} />
                        <span>#{color}</span>
                    </div>
                </Visible>
                <Hidden>
                    <div className={css.picker}>
                        hello
                    </div>
                </Hidden>
            </Panel>
        </div>
    );
}

ColorPicker.initialProps = {
    initialColor: 'ffffff'
};
