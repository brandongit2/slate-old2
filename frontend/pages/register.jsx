import axios from 'axios';
import {validate as validateEmail} from 'email-validator';
import Router from 'next/router';
import React from 'react';
import zxcvbn from 'zxcvbn';

import {Layout} from '../components';
import {errors} from '../constants';
import {UserContext} from '../contexts';

import {verboseErrors} from '../config.json';
import css from './register.scss';

function PasswordStrength(props) {
    return (
        <div className={[
            'password-strength',
            `strength-${props.strength}`,
            props.length === 0 ? 'password-strength-empty' : ''
        ].join(' ')}>
            <div />
            <div />
            <div />
            <div />
            <div />
        </div>
    );
}

export default function Register(props) {
    const {userInfo, setUserInfo} = React.useContext(UserContext);
    
    if (userInfo.isLoggedIn) Router.replace('/');

    // For the form fields.
    const [email, setEmail] = React.useState('');
    const [fName, setFName] = React.useState('');
    const [lName, setLName] = React.useState('');
    const [password, setPassword] = React.useState('');
    // These are shown above their corresponding fields when there are errors.
    const [emailErr, setEmailErr] = React.useState('');
    const [fNameErr, setFNameErr] = React.useState('');
    const [lNameErr, setLNameErr] = React.useState('');
    const [passwordErr, setPasswordErr] = React.useState('');
    const [error, setError] = React.useState(''); // General form errors (e.g. account with e-mail already exists)

    const submitForm = async e => {
        e.preventDefault();
        setError('');

        let valid = true;

        if (email.length === 0) {
            valid = false;
            setEmailErr('Required field.');
        } else if (email.length > 254) {
            valid = false;
            setEmailErr('Maximum of 254 characters.');
        } else if (!validateEmail(email)) {
            valid = false;
            setEmailErr('Invalid e-mail.');
        } else {
            setEmailErr('');
        }

        if (fName.length === 0) {
            valid = false;
            setFNameErr('Required field.');
        } else if (fName.length > 50) {
            valid = false;
            setFNameErr('Max 50 chars.');
        } else {
            setFNameErr('');
        }

        if (lName.length > 50) {
            valid = false;
            setLNameErr('Max 50 chars.');
        } else {
            setLNameErr('');
        }

        if (password.length === 0) {
            valid = false;
            setPasswordErr('Required field.');
        } else if (password.length > 72) {
            valid = false;
            setPasswordErr('Maximum of 72 characters.');
        } else if (zxcvbn(password).score < 2) {
            valid = false;
            setPasswordErr('Password too weak.');
        } else {
            setPasswordErr('');
        }

        if (valid) {
            try {
                const res = await axios.post('http://localhost:3001/api/add-user', {
                    firstName: fName,
                    lastName:  lName,
                    email, password
                }, {withCredentials: true});

                if (res.data.success) {
                    Router.push(`/check-email?email=${email}&fname=${fName}`, '/check-email');
                } else {
                    switch (res.data.error) {
                        case errors.ACCOUNT_EXISTS:
                            setError(<p>An account already exists with that e-mail. Would you like to <a href="/log-in">log in</a> instead?</p>);
                            break;
                        default:
                            if (verboseErrors) console.error(res.data.error);
                            setError('An unknown error occurred.');
                    }
                }
            } catch (err) {
                setError(`Error ${err.response.status}: ${err.response.statusText}`);
            }
        }
    };

    return (
        <Layout currentPage="register" title="Register - Slate" noShadow>
            <div className={css.register}>
                <div id={css.container}>
                    <div id={css.info}>
                        <h1>Benefits of making an account</h1>
                        <ul>
                            <li>
                                <h2>Save your progress (and earn points!)</h2>
                                <p>
                                    After you&apos;ve read an article or finished a problem, Slate will automatically save your progress! In addition to this, you can also see your progress in a unit, course, or subject. The more progress you make, the more points you earn!
                                </p>
                            </li>
                            <li>
                                <h2>Ask questions</h2>
                                <p>
                                    Confused about a subject? Ask a question in the questions box! Feel like helping others? Answer their questions for more points!
                                </p>
                            </li>
                            <li>
                                <h2>Leave comments and feedback</h2>
                                <p>
                                    If you notice a problem or want to address an error, you can leave a message for the developer. Want a feature? Request it, and it may appear in a future version!
                                </p>
                            </li>
                        </ul>
                    </div>
                    <form className={userInfo.theme}>
                        <div>
                            <h1>Make an account</h1>
                            <div className={['error', error === '' ? '' : 'shown'].join(' ')}>
                                <span>{error}</span>
                                <i className="material-icons" onClick={() => setError('')}>close</i>
                            </div>
                        </div>

                        <div className="form-field">
                            <div className="form-label">
                                <label htmlFor="email" className="form-required">E-MAIL</label>
                                <span className="form-label-error">{emailErr}</span>
                            </div>
                            <input id="email"
                                   className={emailErr.length > 0 ? 'form-invalid' : ''}
                                   type="email"
                                   spellCheck="false"
                                   value={email}
                                   onFocus={() => setEmailErr('')}
                                   onChange={e => setEmail(e.target.value)} />
                        </div>

                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: '1rem'}}>
                            <div className="form-field">
                                <div className="form-label">
                                    <label htmlFor="first-name" className="form-required">FIRST NAME</label>
                                    <span className="form-label-error">{fNameErr}</span>
                                </div>
                                <input id="first-name"
                                       className={fNameErr.length > 0 ? 'form-invalid' : ''}
                                       type="text"
                                       spellCheck="false"
                                       value={fName}
                                       onFocus={() => setFNameErr('')}
                                       onChange={e => setFName(e.target.value)} />
                            </div>

                            <div className="form-field">
                                <div className="form-label">
                                    <label htmlFor="last-name">LAST NAME</label>
                                    <span className="form-label-error">{lNameErr}</span>
                                </div>
                                <input id="last-name"
                                       className={lNameErr.length > 0 ? 'form-invalid' : ''}
                                       type="text"
                                       spellCheck="false"
                                       value={lName}
                                       onFocus={() => setLNameErr('')}
                                       onChange={e => setLName(e.target.value)} />
                            </div>
                        </div>

                        <div className="form-field">
                            <div className="form-label">
                                <label htmlFor="password" className="form-required">PASSWORD</label>
                                <span className="form-label-error">{passwordErr}</span>
                            </div>
                            <input id="password"
                                   className={passwordErr.length > 0 ? 'form-invalid' : ''}
                                   type="password"
                                   value={password}
                                   onFocus={() => setPasswordErr('')}
                                   onChange={e => setPassword(e.target.value)} />
                            <PasswordStrength strength={zxcvbn(password).score} length={password.length} />
                        </div>

                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <span><span style={{color: 'red'}}>*</span> required</span>
                            <button onClick={submitForm} className="low">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
