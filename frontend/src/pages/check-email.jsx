import axios from 'axios';
import React from 'react';
import {connect} from 'react-redux';

import {addNotification} from '../actions';
import {Layout} from '../components';
import {apiPrefix2 as apiPrefix, errors, notificationLevels} from '../constants';
import css from './check-email.scss';

class CheckEmail extends React.Component {
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
            const res = await axios.post(apiPrefix + '/resend-verification-email', {
                firstName: this.props.fName,
                email:     this.props.email
            });

            if (res.data.success) {
                this.props.addNotification('E-mail resent.');
            } else if (res.data.error === errors.UNKNOWN) {
                this.props.addNotification('Unknown error occured.', notificationLevels.ERROR);
            }
        }
    };

    render() {
        const {props} = this;
        return (
            <Layout noHeader secondaryLogo>
                <div id={css.page}>
                    <div id={css.container}>
                        <p style={{fontSize: '20pt'}}>You&apos;re almost there!</p>
                        <p style={{fontSize: '14pt'}}>We&apos;ve sent a verification e-mail to <b>{props.email}</b>. Follow the instructions in the e-mail in order to verify your account.</p>
                        <p style={{fontSize: '12pt', color: '#999999'}}>Didn&apos;t get an e-mail? {this.state.counter > 0 ? `Wait ${this.state.counter} second${this.state.counter === 1 ? '' : 's'} and c` : 'C'}lick <a onClick={this.resendEmail} style={{cursor: this.state.counter <= 0 ? 'pointer' : 'not-allowed'}}>this link</a> to resend it.</p>
                    </div>
                </div>
            </Layout>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    addNotification: notification => dispatch(addNotification(notification))
});

export default connect(null, mapDispatchToProps)(CheckEmail);
