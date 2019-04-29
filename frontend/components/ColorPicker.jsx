import React from 'react';

import Panel from './Panel';

import css from './ColorPicker.scss';

export default function ColorPicker(props) {
    const [color, setColor] = React.useState(props.initialColor);
    
    return (
        <div className={css['color-picker']}>
            <Panel visible={(isOpen, {togglePanel}) => (
                       /* eslint-disable-next-line react/jsx-indent */
                       <div className={css.visible} onClick={togglePanel}>
                           <div className={css.preview} style={{background: `#${color}`}} />
                           <span>#{color}</span>
                       </div>
                   )}
                   hidden={() => (
                       <div className={css.picker}>
                           hello
                       </div>
                    )} />
        </div>
    );
}

ColorPicker.initialProps = {
    initialColor: 'ffffff'
};
