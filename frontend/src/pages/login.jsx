import axios from 'axios';
import Router from 'next/router';
import React from 'react';

import {Layout} from '../components';
import css from './login.scss';

export default function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const submit = async e => {
        e.preventDefault();

        const res = await axios.post('/api/authenticate', {email, password});
        
        console.log(window);
        const storage = window.localStorage;
        
        if (res.data.authenticate) {
            storage.setItem('authToken', res.data.token);
            Router.push('/subjects');
        } else {
            setError('Invalid login.');
        }
    };

    return (
        <Layout currentPage="log in" title="Log in - Slate" noShadow>
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
