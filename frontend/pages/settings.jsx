import React from 'react';
import {connect} from 'react-redux';

import {Layout} from '../components';

import css from './settings.scss';

function Settings(props) {
    const [currentOpenPanel, setCurrentOpenPanel] = React.useState('none');
    
    const [email, setEmail] = React.useState(props.user.email);
    const [fName, setFName] = React.useState(props.user.first_name);
    const [lName, setLName] = React.useState(props.user.last_name);
    const [password, setPassword] = React.useState('');
    
    return (
        <Layout title="Settings - Slate" noShadow private>
            <div className={css.settings}>
                <h1>Settings</h1>
                <div className={css.box}>
                    <span className={css['box-header']}>Personal info</span>
                    <div id={css['personal-info']}>
                        <p>E-mail</p>
                        <p>{email}</p>
                        {currentOpenPanel === 'email' ? (
                            <p onClick={() => setCurrentOpenPanel('none')}>(Close)</p>
                        ) : (
                            <p onClick={() => setCurrentOpenPanel('email')}>(Change)</p>
                        )}
                        <div className={currentOpenPanel === 'email' ? css.open : ''}>
                            <input type="email"
                                   value={email}
                                   onChange={e => setEmail(e.target.value)}
                                   style={{width: '15rem', marginRight: '0.5rem'}} />
                        </div>
                        
                        <p>Name</p>
                        <p>{fName} {lName}</p>
                        {currentOpenPanel === 'name' ? (
                            <p onClick={() => setCurrentOpenPanel('none')}>(Close)</p>
                        ) : (
                            <p onClick={() => setCurrentOpenPanel('name')}>(Change)</p>
                        )}
                        <div className={currentOpenPanel === 'name' ? css.open : ''}>
                            <input type="text"
                                   value={fName}
                                   onChange={e => setFName(e.target.value)}
                                   style={{width: '8rem', marginRight: '0.5rem'}} />
                            <input type="text"
                                   value={lName}
                                   onChange={e => setLName(e.target.value)}
                                   style={{width: '8rem', marginRight: '0.5rem'}} />
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
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                        </form>
                        <button className="low" style={{marginTop: '0.6rem'}}>Apply</button>
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
