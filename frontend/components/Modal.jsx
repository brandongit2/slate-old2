import React from 'react';

import {ModalContext} from '../contexts';

import css from './Modal.scss';

export default function Modal() {
    const {modal, hideModal} = React.useContext(ModalContext);
    
    return (
        <div className={[css['modal-background'], modal.isVisible ? css.visible : ''].join(' ')}
             onClick={hideModal}>
            <div className={css.modal}>
                {modal.hasX ? <i className="material-icons" onClick={hideModal}>close</i> : null}
                <p id={css.title}>{modal.title}</p>
                <p id={css.content}>{modal.content}</p>
                <div id={css.buttons}>
                    <div style={{width: '2rem'}} />
                    {modal.buttons.map(button => (
                        <button key={button[0]}
                                className={[button[2], css.button].join(' ')}
                                onClick={button[3]}>
                            {button[1]}
                        </button>
                    ))}
                    <div style={{width: '2rem'}} />
                </div>
            </div>
        </div>
    );
}
