import React from 'react';
import Router, {withRouter} from 'next/router';
import axios from 'axios';
import zxcvbn from 'zxcvbn';


import {Layout} from '../components';
import css from './verify.scss';
import {errors} from '../../backend/src/constants';

// TODO: make this it's own component
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

export default withRouter(props => {
    const [password, setPassword] = React.useState('');
    const [passwordErr, setPasswordErr] = React.useState('');
    const query = props.router.query.query;

    if (!query) {
        Router.push('/subjects');
    }

    // TODO: Actually make this page

    const submitForm = async e => {
        e.preventDefault();
        let valid = true;
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
                const res = await axios.post('/api/change-password', {type: 'query', query, password});

                if (res.data.success) {
                    setTimeout(() => { Router.push('/subjects'); }, 500);
                } else if (res.data.error === errors.QUERY_NOT_IN_DATABASE) {
                    setPasswordErr('The link you used is expired.');
                } else {
                    setPasswordErr('An unknown error occurred.');
                }
            } catch (err) {
                setPasswordErr('An unknown error occurred.');
            }
        }
    };

    return (
        <Layout title="Change Password - Slate" noHeader secondaryLogo>
            <div className={css.changePassword}>
                <form>
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
                        <button onClick={submitForm} type="submit" className="low">Submit</button>
                    </div>
                </form>
            </div>
        </Layout>
    );
});
