import axios from 'axios';
import Router from 'next/router';
import React from 'react';
import {connect} from 'react-redux';

import {addNotification} from '../actions';
import {Layout} from '../components';
import {errors} from '../constants';

import css from './log-in.scss';

function LogIn(props) {
    if (props.user.isLoggedIn) Router.replace('/');

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [stayLoggedIn, toggleStayLoggedIn] = React.useReducer(() => !stayLoggedIn, false);

    const submit = async e => {
        e.preventDefault();

        const res = await axios.post('/api/log-in', {email, password, stayLoggedIn});

        if (res.data.success) {
            setTimeout(() => Router.push('/'), 500);
        } else if (res.data.error === errors.INVALID_LOGIN) {
            setError('Invalid login.');
        } else {
            setError('Unknown error occured.');
        }
    };

    const resetPassword = async () => {
        if (email) {
            const res = (await axios.post('/api/reset-password', {email})).data;
            console.log(res);
            props.addNotification('E-mail sent! Check your inbox for the password reset link.');
        }
    };

    return (
        <Layout currentPage="log in" title="Log in - Slate" noShadow {...props}>
            <div className={css['log-in']}>
                <form className={props.user.theme}>
                    <div>
                        <h1>Log in to Slate</h1>
                        <div className={['error', error === '' ? '' : css.shown].join(' ')}>
                            <span>{error}</span>
                            <i className="material-icons" onClick={() => { setError(''); }}>close</i>
                        </div>
                    </div>

                    <div className="form-field">
                        <div className="form-label">
                            <label htmlFor="email">E-MAIL</label>
                        </div>
                        <input id="email"
                               type="email"
                               spellCheck="false"
                               value={email}
                               onChange={e => setEmail(e.target.value)} />
                    </div>

                    <div className="form-field" style={{marginBottom: '0.5rem'}}>
                        <div className="form-label">
                            <label htmlFor="password">PASSWORD</label>
                            <p id={css['forgot-password']} onClick={resetPassword}>(Forgot password?)</p>
                        </div>
                        <input id="password"
                               type="password"
                               value={password}
                               onChange={e => setPassword(e.target.value)} />
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: 'auto auto', gridColumnGap: '0.5rem'}}>
                        <div style={{display: 'flex', alignItems: 'center', flexGrow: 1}}>
                            <input type="checkbox"
                                   name="stay-logged-in"
                                   value={stayLoggedIn}
                                   onClick={toggleStayLoggedIn} />
                            <label htmlFor="stay-logged-in" id={css['stay-logged-in']}>Stay logged in</label>
                        </div>
                        <button onClick={submit}>Submit</button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

function mapStateToProps(state) {
    return {
        user:  state.user,
        theme: state.user.theme
    };
}

const actionCreators = {
    addNotification
};

export default connect(mapStateToProps, actionCreators)(LogIn); /* eslint-disable-line no-func-assign */
