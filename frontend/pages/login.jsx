import axios from 'axios';
import Router from 'next/router';
import React from 'react';
import {connect} from 'react-redux';

import {Layout} from '../components';
import css from './login.scss';

export default function Login(props) {
    if (props.user.isLoggedIn) Router.replace('/');
    
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const submit = async e => {
        e.preventDefault();

        const res = await axios.post('/api/authenticate', {email, password});
        
        if (res.data.success) {
            Router.push('/subjects');
        } else {
            setError('Invalid login.');
        }
    };

    return (
        <Layout currentPage="log in" title="Log in - Slate" noShadow {...props}>
            <div id={css.container}>
                <form>
                    <h1>Log in to Slate</h1>

                    <div id={css.error} className={error === '' ? '' : css.shown}>
                        <p>{error}</p>
                        <i className="material-icons" onClick={() => { setError(''); }}>close</i>
                    </div>

                    <div className={css.input}>
                        <div className={css.label}>
                            <label htmlFor="email">E-MAIL</label>
                        </div>
                        <input id="email"
                               type="email"
                               spellCheck="false"
                               value={email}
                               onChange={e => setEmail(e.target.value)} />
                    </div>

                    <div className={css.input}>
                        <div className={css.label}>
                            <label htmlFor="password">PASSWORD</label>
                        </div>
                        <input id="password"
                               type="password"
                               value={password}
                               onChange={e => setPassword(e.target.value)} />
                    </div>

                    <button onClick={submit}>Submit</button>
                </form>
            </div>
        </Layout>
    );
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

Login = connect(mapStateToProps)(Login); /* eslint-disable-line no-func-assign */
