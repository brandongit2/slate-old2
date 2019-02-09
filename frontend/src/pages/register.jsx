import {validate as validateEmail} from 'email-validator';
import React from 'react';
import zxcvbn from 'zxcvbn';

import {Layout} from '../components';
import css from './register.scss';

const PasswordStrength = props => (
    <div className={`${css['password-strength']} ${css[`strength-${props.strength}`]}`}>
        <div className={props.length > 0 ? css.filled : ''} />
        <div className={props.strength >= 1 ? css.filled : ''} />
        <div className={props.strength >= 2 ? css.filled : ''} />
        <div className={props.strength >= 3 ? css.filled : ''} />
        <div className={props.strength >= 4 ? css.filled : ''} />
    </div>
);

export default function Register() {
    const [password, setPassword] = React.useState('');
    const [emailErr, setEmailErr] = React.useState('');
    const [fNameErr, setFNameErr] = React.useState('');
    const [passwordErr, setPasswordErr] = React.useState('');
    const emailField = React.useRef();
    const fNameField = React.useRef();
    const lNameField = React.useRef();
    const passwordField = React.useRef();

    const changePassword = e => {
        setPassword(e.target.value);
    };

    const submitForm = e => {
        e.preventDefault();

        let valid = true;

        if (emailField.current.value.length === 0) {
            valid = false;
            emailField.current.classList.add(css.invalid);
            setEmailErr('Required field.');
        } else if (!validateEmail(emailField.current.value)) {
            valid = false;
            emailField.current.classList.add(css.invalid);
            setEmailErr('Invalid e-mail.');
        } else {
            emailField.current.classList.remove(css.invalid);
            setEmailErr('');
        }

        if (fNameField.current.value.length === 0) {
            valid = false;
            fNameField.current.classList.add(css.invalid);
            setFNameErr('Required field.');
        } else {
            fNameField.current.classList.remove(css.invalid);
            setFNameErr('');
        }

        if (passwordField.current.value.length === 0) {
            valid = false;
            passwordField.current.classList.add(css.invalid);
            setPasswordErr('Required field.');
        } else if (zxcvbn(passwordField.current.value).score < 2) {
            valid = false;
            passwordField.current.classList.add(css.invalid);
            setPasswordErr('Password too weak.');
        } else {
            passwordField.current.classList.remove(css.invalid);
            setPasswordErr('');
        }

        if (valid) console.log('post');
    };

    return (
        <Layout currentPage="register" title="Register - Slate" noShadow>
            <div id={css.register}>
                <div id={css.container}>
                    <div id={css.info}>
                        <h1>Benefits of signing up for Slate</h1>
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
                        <div className={css.input}>
                            <div className={css.label}>
                                <label htmlFor="email" className={css.required}>E-MAIL ADDRESS</label>
                                <span className={css['error-message']}>{emailErr}</span>
                            </div>
                            <input id="email" type="email" spellCheck="false" ref={emailField} />
                        </div>

                        <div id={css.name}>
                            <div className={css.input}>
                                <div className={css.label}>
                                    <label htmlFor="first-name" className={css.required}>FIRST NAME</label>
                                    <span className={css['error-message']}>{fNameErr}</span>
                                </div>
                                <input id="first-name" type="text" spellCheck="false" ref={fNameField} />
                            </div>

                            <div className={css.input}>
                                <div className={css.label}>
                                    <label htmlFor="last-name">LAST NAME</label>
                                </div>
                                <input id="last-name" type="text" spellCheck="false" ref={lNameField} />
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
                                   onChange={changePassword}
                                   ref={passwordField} />
                            <PasswordStrength strength={zxcvbn(password).score} length={password.length} />
                        </div>

                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <span><span style={{color: 'red'}}>*</span> required</span>
                            <button style={{float: 'right'}} onClick={submitForm}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
