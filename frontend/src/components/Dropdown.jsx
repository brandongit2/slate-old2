import React from 'react';
import {generate} from 'shortid';

import css from './Dropdown.scss';

export default function Dropdown(props) {
    const [selected, changeSelected] = React.useState(props.label);
    const [isOpen, setIsOpen] = React.useState(false);
    const toggleIsOpen = () => setIsOpen(!isOpen);
    
    return (
        <div className={[css.button, isOpen ? css.open : '', props.mini ? css.mini : ''].join(' ')}
             onBlur={() => setIsOpen(false)}
             tabIndex="0">
            <div id={css.visible} onClick={toggleIsOpen}>
                {selected}
                <i className="material-icons">arrow_drop_down</i>
            </div>
            <div id={css.items}>
                <div>
                    {props.children && props.children.map(child => (
                        <div key={generate()} onClick={() => {
                            changeSelected(child.props.children);
                            setIsOpen(false);
                        }}>
                            {child}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function Item(props) {
    return <div className={css.item} id={generate()}>{props.children}</div>;
}
