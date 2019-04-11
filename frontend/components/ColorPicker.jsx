import React from 'react';

import css from './ColorPicker.scss';

export default function ColorPicker(props) {
    const [color, setColor] = React.useState(props.initialColor);
    
    return (
        <div className={css['color-picker']}>
            <div className={css.preview} style={{background: color}} />
            <div className={css.picker}></div>
        </div>
    );
}

ColorPicker.initialProps = {
    initialColor: '#ffffff'
};
