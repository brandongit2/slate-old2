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
                        button[1] = action.value;
                        return button;
                    } else {
                        return button;
                    }
                });
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
        <Layout>
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
                    <form id={css['modal-form']}>
                        <label htmlFor="title">Title:</label>
                        <input type="text"
                               name="title"
                               value={modalTitle}
                               onChange={e => setModalTitle(e.target.value)} />
                        
                        <label htmlFor="content">Content:</label>
                        <textarea name="content"
                                  value={modalContent}
                                  onChange={e => setModalContent(e.target.value)} />
                        
                        <label htmlFor="add-button">Buttons:</label>
                        <button name="add-button" onClick={e => {
                                e.preventDefault();
                                changeModalButtons({type: 'add'});
                        }}>Add button</button>
                        <div style={{gridColumnEnd: 3}}>{modalButtons.map(button => (
                            <input key={button[0]}
                                   type="text"
                                   name="button"
                                   value={button[1]}
                                   onChange={e => changeModalButtons({
                                       type:  'modify',
                                       id:    button[0],
                                       value: e.target.value
                                   })} />
                        ))}</div>
                        
                        
                        <label htmlFor="has-x">Has X:</label>
                        <input type="checkbox"
                               name="has-x"
                               checked={modalHasX}
                               onChange={e => setModalHasX(e.target.checked)} />
                        
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
                    <button className="med">Medium severity button</button>
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
