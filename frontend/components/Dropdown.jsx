import React from 'react';
import {generate} from 'shortid';

import {Panel} from './Panel';

import css from './Dropdown.scss';

export default function Dropdown(props) {
    const [selected, changeSelected] = React.useState(props.label); // The text that shows when the dropdown isn't open
    const [isOpen, setIsOpen] = React.useState(false);
    const toggleIsOpen = () => setIsOpen(!isOpen);
    
    return (
        <div className={[css.dropdown, isOpen ? css.open : '', props.mini ? css.mini : ''].join(' ')}
             onBlur={() => setIsOpen(false)}
             tabIndex="0">
            <div id={css.visible} onClick={toggleIsOpen}>
                <span className="dropdown-label">{selected}</span>
                <i className="material-icons">{'arrow_drop_' + (isOpen ? 'up' : 'down')}</i>
            </div>
            <div className="dropdown-items" id={css.items}>
                <div>
                    {Array.isArray(props.children)
                        ? props.children.map(child => (
                            <div key={generate()}
                                 onClick={() => {
                                     changeSelected(child.props.children);
                                     setIsOpen(false);
                                 }}
                                 className={child.props.children === selected ? css.bold : ''}>
                                <span className="dropdown-item">{child}</span>
                            </div>
                        )) : (
                            <div key={generate()}
                                 onClick={() => {
                                     changeSelected(props.children.props.children);
                                     setIsOpen(false);
                                 }}
                                 className={props.children.props.children === selected ? css.bold : ''}>
                                {props.children}
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export function Item(props) {
    return <div className={css.item} onClick={props.onClick}>{props.children}</div>;
}
