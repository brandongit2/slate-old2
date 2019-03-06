import React from 'react';
import {connect} from 'react-redux';

import {Layout} from '../components';

import css from './settings.scss';

function Settings(props) {
    const [currentOpenPanel, setCurrentOpenPanel] = React.useState('none');
    
    return (
        <Layout title="Settings - Slate" {...props}>
            <div id={css.container}>
                <h1>Settings</h1>
                <div className={css.box}>
                    <span className={css['box-header']}>Personal info</span>
                    <div id={css['personal-info']}>
                        <p>E-mail</p>
                        <p>{props.user.email}</p>
                        {currentOpenPanel === 'email' ? (
                            <p onClick={() => setCurrentOpenPanel('none')}>(Close)</p>
                        ) : (
                            <p onClick={() => setCurrentOpenPanel('email')}>(Change)</p>
                        )}
                        <div className={currentOpenPanel === 'email' ? css.open : ''}>
                            <input type="email" />
                            <button className="low">Apply</button>
                        </div>
                        
                        <p>First name</p>
                        <p>{props.user.first_name}</p>
                        {currentOpenPanel === 'firstName' ? (
                            <p onClick={() => setCurrentOpenPanel('none')}>(Close)</p>
                        ) : (
                            <p onClick={() => setCurrentOpenPanel('firstName')}>(Change)</p>
                        )}
                        <div className={currentOpenPanel === 'firstName' ? css.open : ''}>
                            <input type="text" />
                            <button className="low">Apply</button>
                        </div>
                        
                        <p>Last name</p>
                        <p>{props.user.last_name}</p>
                        {currentOpenPanel === 'lastName' ? (
                            <p onClick={() => setCurrentOpenPanel('none')}>(Close)</p>
                        ) : (
                            <p onClick={() => setCurrentOpenPanel('lastName')}>(Change)</p>
                        )}
                        <div className={currentOpenPanel === 'lastName' ? css.open : ''}>
                            <input type="text" />
                            <button className="low">Apply</button>
                        </div>
                        
                        <p>Password</p>
                        <p>**********</p>
                        {currentOpenPanel === 'password' ? (
                            <p onClick={() => setCurrentOpenPanel('none')}>(Close)</p>
                        ) : (
                            <p onClick={() => setCurrentOpenPanel('password')}>(Change)</p>
                        )}
                        <form id={css.password} className={currentOpenPanel === 'password' ? css.open : ''}>
                            <div className="form-field" style={{marginRight: '0px'}}>
                                <label htmlFor="old-password">Old password</label>
                                <input type="password" name="old-password" />
                            </div>
                            <div className="form-field">
                                <label htmlFor="new-password">New password</label>
                                <input type="password" />
                            </div>
                            <button className="low" style={{justifySelf: 'end'}}>Apply</button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

export default connect(mapStateToProps)(Settings);
