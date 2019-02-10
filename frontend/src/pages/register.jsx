import axios from 'axios';
import {validate as validateEmail} from 'email-validator';
import React from 'react';
import zxcvbn from 'zxcvbn';

import {Layout} from '../components';
import {apiPrefix1, apiPrefix2} from '../constants';
import css from './register.scss';

const PasswordStrength = props => (
    <div className={`${css['password-strength']} ${css[`strength-${props.strength}`]} ${props.length === 0 ? css.empty : ''}`}>
        <div />
        <div />
        <div />
        <div />
        <div />
    </div>
);

export default function Register() {
    const [email, setEmail] = React.useState('');
    const [fName, setFName] = React.useState('');
    const [lName, setLName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [emailErr, setEmailErr] = React.useState('');
    const [fNameErr, setFNameErr] = React.useState('');
    const [lNameErr, setLNameErr] = React.useState('');
    const [passwordErr, setPasswordErr] = React.useState('');
    const [error, setError] = React.useState(''); // General form errors (e.g. account with e-mail already exists)
    const emailField = React.useRef();
    const fNameField = React.useRef();
    const lNameField = React.useRef();
    const passwordField = React.useRef();

    const submitForm = e => {
        e.preventDefault();

        let valid = true;

        if (email.length === 0) {
            valid = false;
            emailField.current.classList.add(css.invalid);
            setEmailErr('Required field.');
        } else if (email.length > 254) {
            valid = false;
            emailField.current.classList.add(css.invalid);
            setEmailErr('Maximum length of 254 characters.');
        } else if (!validateEmail(email)) {
            valid = false;
            emailField.current.classList.add(css.invalid);
            setEmailErr('Invalid e-mail.');
        } else {
            emailField.current.classList.remove(css.invalid);
            setEmailErr('');
        }

        if (fName.length === 0) {
            valid = false;
            fNameField.current.classList.add(css.invalid);
            setFNameErr('Required field.');
        } else if (fName.length > 50) {
            valid = false;
            fNameField.current.classList.add(css.invalid);
            setFNameErr('Max 50 chars.');
        } else {
            fNameField.current.classList.remove(css.invalid);
            setFNameErr('');
        }

        if (lName.length > 50) {
            valid = false;
            lNameField.current.classList.add(css.invalid);
            setLNameErr('Max 50 chars.');
        } else {
            lNameField.current.classList.remove(css.invalid);
            setLNameErr('');
        }

        if (password.length === 0) {
            valid = false;
            passwordField.current.classList.add(css.invalid);
            setPasswordErr('Required field.');
        } else if (password.length > 72) {
            valid = false;
            passwordField.current.classList.add(css.invalid);
            setPasswordErr('Maximum of 72 characters.');
        } else if (zxcvbn(password).score < 2) {
            valid = false;
            passwordField.current.classList.add(css.invalid);
            setPasswordErr('Password too weak.');
        } else {
            passwordField.current.classList.remove(css.invalid);
            setPasswordErr('');
        }

        if (valid) {
            const apiPrefix = process.env ? apiPrefix2 : apiPrefix1;
            axios.post(apiPrefix + '/add-user', {
                firstName: fName,
                lastName:  lName,
                email, password
            }).then(res => {
                if (res.data.success) {
                    console.log('good job!');
                    setError('');
                } else {
                    switch (res.data.error.errno) {
                        case 1062:
                            setError('An account already exists with that e-mail.');
                            break;
                        default:
                            setError('Unknown error code ' + res.data.error.errno + '.');
                            console.log(res.data.error);
                    }
                }
            }).catch(err => {
                setError(`Error ${err.response.status}: ${err.response.statusText}`);
            });
        }
    };

    return (
        <Layout currentPage="register" title="Register - Slate" noShadow>
            <div id={css.register}>
                <div id={css.container}>
                    <div id={css.info}>
                        <h1>Benefits of making an account</h1>
                        <ul>
                            <li>
                                <h2>Save your progress (and earn points!)</h2>
                                <p>
                                    After you&apos;ve read an article or finished a problem, Slate will automatically
                                    save your progress! In addition to this, you can also see your progress in a unit,
                                    course, or subject. The more progress you make, the more points you earn!
                                </p>
                            </li>
                            <li>
                                <h2>Ask questions</h2>
                                <p>
                                    Confused about a subject? Ask a question in the questions box! Feel like helping
                                    others? Answer their questions for more points!
                                </p>
                            </li>
                            <li>
                                <h2>Leave comments and feedback</h2>
                                <p>
                                    If you notice a problem or want to address an error, you can leave a message for the
                                    developer. Want a feature? Request it, and it may appear in a future version!
                                </p>
                            </li>
                        </ul>
                    </div>
                    <form>
                        <h1>Make an account</h1>

                        <div id={css.error} className={error === '' ? '' : css.shown}>
                            <p>{error}</p>
                            <i className="material-icons" onClick={() => { setError(''); }}>close</i>
                        </div>

                        <div className={css.input}>
                            <div className={css.label}>
                                <label htmlFor="email" className={css.required}>E-MAIL</label>
                                <span className={css['error-message']}>{emailErr}</span>
                            </div>
                            <input id="email"
                                   type="email"
                                   spellCheck="false"
                                   value={email}
                                   onChange={e => setEmail(e.target.value)}
                                   ref={emailField} />
                        </div>

                        <div id={css.name}>
                            <div className={css.input}>
                                <div className={css.label}>
                                    <label htmlFor="first-name" className={css.required}>FIRST NAME</label>
                                    <span className={css['error-message']}>{fNameErr}</span>
                                </div>
                                <input id="first-name"
                                       type="text"
                                       spellCheck="false"
                                       value={fName}
                                       onChange={e => setFName(e.target.value)}
                                       ref={fNameField} />
                            </div>

                            <div className={css.input}>
                                <div className={css.label}>
                                    <label htmlFor="last-name">LAST NAME</label>
                                    <span className={css['error-message']}>{lNameErr}</span>
                                </div>
                                <input id="last-name"
                                       type="text"
                                       spellCheck="false"
                                       value={lName}
                                       onChange={e => setLName(e.target.value)}
                                       ref={lNameField} />
                            </div>
                        </div>

                        <div className={css.input}>
                            <div className={css.label}>
                                <label htmlFor="password" className={css.required}>PASSWORD</label>
                                <span className={css['error-message']}>{passwordErr}</span>
                            </div>
                            <input id="password"
                                   className={css['no-bottom-margin']}
                                   type="password"
                                   value={password}
                                   onChange={e => setPassword(e.target.value)}
                                   ref={passwordField} />
                            <PasswordStrength strength={zxcvbn(password).score} length={password.length} />
                        </div>

                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <span><span style={{color: 'red'}}>*</span> required</span>
                            <button onClick={submitForm}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
