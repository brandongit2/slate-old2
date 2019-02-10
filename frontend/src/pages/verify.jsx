import React from 'react';
import Router from 'next/router';

import css from './verify.scss';

export default class Verify extends React.Component {
    state = {
        counter: 5
    };

    componentDidMount() {
        setTimeout(() => { Router.push('/subjects'); }, 5000);
        setInterval(() => {
            this.setState({counter: this.state.counter - 1});
        }, 1000);
    }

    render() {
        return (
            <div id={css.container}>
                <img src="/static/slate-logo.svg" />
                <p><b>Verification success!</b> You will be redirected to the main page in {this.state.counter} second{this.state.counter === 1 ? '' : 's'}.</p>
            </div>
        );
    }
}
