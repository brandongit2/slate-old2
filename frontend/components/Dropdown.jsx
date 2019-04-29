import React from 'react';
import {generate} from 'shortid';
import SimpleBar from 'simplebar-react';

import Panel from './Panel';

import 'simplebar/dist/simplebar.min.css';
import css from './Dropdown.scss';

export default function Dropdown(props) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selected, changeSelected] = React.useState(props.label); // The text that shows when the dropdown isn't open
    
    return (
        <div className={[css.dropdown, props.mini ? css.mini : '', isOpen ? css.open : ''].join(' ')}
             tabIndex="0">
            <Panel visible={(isOpen, {togglePanel}) => {
                       setIsOpen(isOpen);
                       return (
                           <div className={css.visible} onClick={togglePanel}>
                               <span>{selected}</span>
                               <i className="material-icons">{`arrow_drop_${isOpen ? 'up' : 'down'}`}</i>
                           </div>
                       );
                   }}
                   hidden={(isOpen, {closePanel}) => {
                       setIsOpen(isOpen);
                       return (
                           <SimpleBar className={css.items}>
                               {Array.isArray(props.children)
                                   ? props.children.map(child => (
                                       <div key={generate()}
                                            onClick={() => {
                                                changeSelected(child.props.children);
                                                closePanel();
                                            }}
                                            className={child.props.children === selected ? css.bold : ''}>
                                           <span>{child}</span>
                                       </div>
                                   )) : (
                                       <div key={generate()}
                                            onClick={() => {
                                                changeSelected(props.children.props.children);
                                                closePanel();
                                            }}
                                            className={props.children.props.children === selected ? css.bold : ''}>
                                           {props.children}
                                       </div>
                                   )
                               }
                           </SimpleBar>
                       );
                   }} />
        </div>
    );
}

export function Item(props) {
    return <div className={css.item} onClick={props.onClick}>{props.children}</div>;
}
