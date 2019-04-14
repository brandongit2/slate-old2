import React from 'react';
import {connect} from 'react-redux';
import {generate} from 'shortid';

import {showModal} from '../../../actions';
import {Dropdown} from '../../../components';
import {severities} from '../../../constants';
import {Item} from '../../../components/Dropdown';

import css from './modals.scss';

function ModalTest(props) {
    const [modalTitle, setModalTitle] = React.useState('');
    const [modalContent, setModalContent] = React.useState('');
    const [modalButtons, changeModalButtons] = React.useReducer((state = [], action) => {
        switch (action.type) {
            case 'add':
                return [...state, [generate(), '', severities.LOW, props.hideModal]];
            case 'modify':
                return state.map(button => {
                    if (button[0] === action.id) {
                        if (action.value) button[1] = action.value;
                        if (action.severity) button[2] = action.severity;
                        return button;
                    } else {
                        return button;
                    }
                });
            case 'delete':
                return state.filter(button => button[0] === action.id);
            default:
                return state;
        }
    }, []);
    const [modalHasX, setModalHasX] = React.useState(true);
    
    const submitModalForm = e => {
        e.preventDefault();
        props.showModal(modalTitle, modalContent, modalButtons, modalHasX);
    };
    
    return (
        <div className={css['modal-test']}>
            <form style={{width: '25rem'}}>
                <div className="form-field">
                    <label htmlFor="title">Title</label>
                    <input type="text"
                           name="title"
                           value={modalTitle}
                           onChange={e => setModalTitle(e.target.value)} />
                </div>
                
                <div className="form-field">
                    <label htmlFor="content">Content</label>
                    <textarea name="content"
                              value={modalContent}
                              onChange={e => setModalContent(e.target.value)} />
                </div>
                
                <div className="form-field" style={{flexDirection: 'row', alignItems: 'center'}}>
                    <label htmlFor="has-x" style={{marginRight: '5px'}}>Has X:</label>
                    <input type="checkbox"
                           name="has-x"
                           checked={modalHasX}
                           style={{marginTop: '0px'}}
                           onChange={e => setModalHasX(e.target.checked)} />
                </div>
                
                {modalButtons.length > 0
                    ? (
                        <div style={{display: 'grid', gridTemplateColumns: '1fr auto', gridGap: '10px'}}>
                            <label>Button text</label>
                            <label>Severity</label>
                            {modalButtons.map(button => (
                                <React.Fragment key={button[0]}>
                                    <input type="text"
                                           name="button"
                                           value={button[1]}
                                           onChange={e => changeModalButtons({
                                                type:  'modify',
                                                id:    button[0],
                                                value: e.target.value
                                            })} />
                                    <Dropdown label="Low">
                                        <Item onClick={() => changeModalButtons({
                                                    type:     'modify',
                                                    id:       button[0],
                                                    severity: severities.LOW
                                                })}>
                                            Low
                                        </Item>
                                        <Item onClick={() => changeModalButtons({
                                                    type:     'modify',
                                                    id:       button[0],
                                                    severity: severities.MED
                                                })}>
                                            Medium
                                        </Item>
                                        <Item onClick={() => changeModalButtons({
                                                    type:     'modify',
                                                    id:       button[0],
                                                    severity: severities.HIGH
                                                })}>
                                            High
                                        </Item>
                                    </Dropdown>
                                </React.Fragment>
                            ))}
                        </div>
                    ) : null
                }
                
                <button onClick={e => {
                    e.preventDefault();
                    changeModalButtons({type: 'add'});
                }}>
                    Add button
                </button>
                
                <button className="low" onClick={submitModalForm}>Show modal</button>
            </form>
        </div>
    );
}

const actionCreators = {
    showModal
};

export default connect(null, actionCreators)(ModalTest);
