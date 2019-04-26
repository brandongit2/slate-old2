import axios from 'axios';
import React from 'react';

import {Layout} from '../components';
import {errors, severities} from '../constants';
import {NotificationsContext} from '../contexts';

import css from './check-email.scss';

export default class CheckEmail extends React.Component {
    static contextType = NotificationsContext;
    
    state = {
        counter: 20
    };
    
    static getInitialProps = async ({query, req}) => {
        if (req) { // If being run on server
            return {
                email: req.query.email,
                fName: req.query.fname
            };
        } else {
            return {
                email: query.email,
                fName: query.fname
            };
        }
    };
    
    componentDidMount() {
        setInterval(() => {
            this.setState({counter: this.state.counter - 1});
        }, 1000);
    }
    
    resendEmail = async () => {
        if (this.state.counter <= 0) {
            const res = await axios.post('/api/resend-verification-email', {
                firstName: this.props.fName,
                email:     this.props.email
            });
            
            if (res.data.success) {
                this.context.addNotification('E-mail resent.');
            } else if (res.data.error === errors.UNKNOWN) {
                this.context.addNotification('Unknown error occured.', severities.ERROR);
            }
        }
    };
    
    render() {
        const {props} = this;
        return (
            <Layout title="Verifying email... - Slate" noHeader secondaryLogo>
                <div className={css['check-email']}>
                    <div id={css.container}>
                        <p style={{fontSize: '20pt'}}>You&apos;re almost there!</p>
                        <p style={{fontSize: '14pt'}}>We&apos;ve sent a verification e-mail to <b>{props.email}</b>. Follow the instructions in the e-mail in order to verify your account.</p>
                        <p style={{fontSize: '12pt'}} id={css['light-text']}>Didn&apos;t get an e-mail? {this.state.counter > 0 ? `Wait ${this.state.counter} second${this.state.counter === 1 ? '' : 's'} and c` : 'C'}lick <a onClick={this.resendEmail} style={{cursor: this.state.counter <= 0 ? 'pointer' : 'not-allowed'}}>this link</a> to resend it.</p>
                    </div>
                </div>
            </Layout>
        );
    }
}
