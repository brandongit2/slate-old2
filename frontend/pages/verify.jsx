import React from 'react';
import Router, {withRouter} from 'next/router';

import {Layout} from '../components';
import css from './verify.scss';

export default withRouter(class Verify extends React.Component {
    state = {
        counter: 5
    };
    
    componentDidMount() {
        if (this.props.router.query.success === 'true') {
            setTimeout(() => { Router.push('/subjects'); }, 5000);
            setInterval(() => {
                this.setState({counter: this.state.counter - 1 >= 0 ? this.state.counter - 1 : 0});
            }, 1000);
        }
    }
    
    render() {
        return (
            <Layout title="Verification success! - Slate" noHeader secondaryLogo>
                <div className={css.verify}>
                    {this.props.router.query.success === 'true'
                        ? <p><b>Verification success!</b> You will be redirected to the main page in {this.state.counter} second{this.state.counter === 1 ? '' : 's'}.</p>
                        : <p><b>Sorry, we were unable to verify your email.</b> This could be because you clicked on an old link. <a>Click here</a> to have your verification e-mail resent.</p>
                    }
                </div>
            </Layout>
        );
    }
});
