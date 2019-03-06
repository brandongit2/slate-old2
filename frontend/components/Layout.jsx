/*
 * Wrap pages in this component in order to have page titles and headers.
 */

import Head from 'next/head';
import React from 'react';
import {connect} from 'react-redux';

import {Header, Modal, Snackbar} from './';
import {logIn} from '../actions';

import css from './Layout.scss';

const layoutStyles = {
    width:  '100vw',
    height: '100vh'
};

class Layout extends React.Component {
    constructor(props) {
        super(props);
        
        props.logIn();
    }
    
    render() {
        const {props} = this;
        return (
            <div className={props.className}
                 id={css.layout}
                 style={Object.assign(layoutStyles, props.style)}>
                <Head>
                    <title>{props.title}</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <link rel="shortcut icon" href="/static/favicon.png" />
                </Head>
                <Modal />
                {props.noHeader
                    ? null
                    : (
                        <Header currentPage={props.currentPage}
                                float={props.headerFloat}
                                noShadow={props.noShadow}
                                user={props.altUser ? props.altUser : props.user} />
                    )
                }
                {props.secondaryLogo
                    ? <img src="/static/slate-logo.svg" id={css['secondary-logo']} />
                    : null
                }
                <Snackbar />
                {props.children}
            </div>
        );
    }
}

Layout.defaultProps = {
    className:   '',
    headerFloat: false,
    style:       {},
    title:       'Slate'
};

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

const actionCreators = {
    logIn
};

export default connect(mapStateToProps, actionCreators)(Layout);