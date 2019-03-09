/*
 * Wrap pages in this component in order to have page titles and headers.
 */

import Head from 'next/head';
import React from 'react';
import {connect} from 'react-redux';

import {Header, Modal, Snackbar} from './';
import {authenticate} from '../actions';

import css from './Layout.scss';

const layoutStyles = {
    width:  '100vw',
    height: '100vh'
};

class Layout extends React.Component {
    constructor(props) {
        super(props);
        
        props.authenticate();
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
                    <link rel="stylesheet"
                          href="https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css"
                          integrity="sha384-dbVIfZGuN1Yq7/1Ocstc1lUEm+AT+/rCkibIcC/OmWo5f0EA48Vf8CytHzGrSwbQ"
                          crossOrigin="anonymous" />
                </Head>
                <style jsx global>{`
                    :root {
                        ${(props.theme ? props.theme : (props.altUser ? props.altUser.theme : 'light')) === 'light' ? `
                            --text-color: rgba(0, 0, 0, 1);
                            --secondary-text-color: rgba(0, 0, 0, 0.7);
                            --tertiary-text-color: rgba(0, 0, 0, 0.5);
                            --border-color: rgba(0, 0, 0, 0.3);
                            --border-hover-color: rgba(0, 0, 0, 0.6);
                            --secondary-border-color: rgba(0, 0, 0, 0.1);
                            --background-color: #fff;
                            --secondary-background-color: #fff;
                            --shadow-color: rgba(0, 0, 0, 0.1);
                        ` : `
                            --text-color: rgba(255, 255, 255, 0.8);
                            --secondary-text-color: rgba(255, 255, 255, 0.5);
                            --tertiary-text-color: rgba(255, 255, 255, 0.3);
                            --border-color: rgba(255, 255, 255, 0.2);
                            --border-hover-color: rgba(255, 255, 255, 0.6);
                            --secondary-border-color: rgba(255, 255, 255, 0.0);
                            --background-color: #111;
                            --secondary-background-color: #222;
                            --shadow-color: rgba(255, 255, 255, 0);
                        `}
                    }
                    
                    .bw-icon {
                        ${(props.theme ? props.theme : (props.altUser ? props.altUser.theme : 'light')) === 'light'
                            ? ''
                            : 'filter: invert(1);'
                        }
                        transition: filter 0.5s;
                    }
                `}</style>
                <Modal />
                {props.noHeader
                    ? null
                    : (
                        <Header currentPage={props.currentPage}
                                float={props.headerFloat}
                                noShadow={props.noShadow}
                                user={!props.user.isLoggedIn && props.altUser ? props.altUser : props.user} />
                    )
                }
                {props.secondaryLogo
                    ? <img src="/static/slate-logo.svg" id={css['secondary-logo']} className="bw-icon" />
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
    currentPage: '',
    headerFloat: false,
    noShadow:    false,
    style:       {},
    title:       'Slate'
};

function mapStateToProps(state) {
    return {
        user:  state.user,
        theme: state.user.theme
    };
}

const actionCreators = {
    authenticate
};

export default connect(mapStateToProps, actionCreators)(Layout);
