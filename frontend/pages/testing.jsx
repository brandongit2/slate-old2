import React from 'react';
import {connect} from 'react-redux';
import {generate} from 'shortid';

import {addNotification, showModal} from '../actions';
import {Dropdown, Item, Layout} from '../components';
import {severities} from '../constants';

import css from './testing.scss';

function Testing(props) {
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
        <Layout title="Testing - Slate" {...props}>
            <div id={css.container}>
                <div>
                    <h1>Notifications</h1>
                    <button onClick={() => props.addNotification('test notification', severities.INFO, 2000)}>
                        Add an info notification
                    </button>
                    <button onClick={() => props.addNotification('test notification', severities.WARN, 2000)}>
                        Add a warn notification
                    </button>
                    <button onClick={() => props.addNotification('test notification', severities.ERROR, 2000)}>
                        Add an error notification
                    </button>
                </div>
                <div>
                    <h1>Modal</h1>
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
                <div>
                    <h1>Dropdown test</h1>
                    <Dropdown label="Select an item...">
                        <Item>Item #1</Item>
                        <Item>Item #2</Item>
                        <Item>Item #3</Item>
                        <Item>Item #4</Item>
                        <Item>Loooooooooooooooooooooooooooooooong list item</Item>
                        <Item>Item #6</Item>
                        <Item>Item #7</Item>
                        <Item>Item #8</Item>
                        <Item>Item #9</Item>
                        <Item>Item #10</Item>
                        <Item>Item #11</Item>
                        <Item>Item #12</Item>
                        <Item>Item #13</Item>
                    </Dropdown>
                    <Dropdown mini label="Mini dropdown">
                        <Item>Item #1</Item>
                        <Item>Item #2</Item>
                        <Item>Item #3</Item>
                        <Item>Item #4</Item>
                        <Item>Loooooooooooooooooooooooooooooooong list item</Item>
                        <Item>Item #6</Item>
                        <Item>Item #7</Item>
                        <Item>Item #8</Item>
                        <Item>Item #9</Item>
                        <Item>Item #10</Item>
                        <Item>Item #11</Item>
                        <Item>Item #12</Item>
                        <Item>Item #13</Item>
                    </Dropdown>
                </div>
                <div>
                    <h1>Buttons</h1>
                    <button>Regular plain-old boring button</button>
                    <button className="low">Low-severity button</button>
                    <button className="med">Medium-severity button</button>
                    <button className="high">High-severity button</button>
                </div>
            </div>
        </Layout>
    );
}

const actionCreators = {
    addNotification, showModal
};

export default connect(null, actionCreators)(Testing);
