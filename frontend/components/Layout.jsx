/*
 * Wrap pages in this component in order to have page titles and headers.
 */

import Head from 'next/head';
import React from 'react';
import {connect} from 'react-redux';

import {Header, Modal, Snackbar} from './';
import {authenticate} from '../actions';

import css from './Layout.scss';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        
        props.authenticate();
    }
    
    render() {
        const {props} = this;
        return (
            <div className={[css.layout, props.className].join(' ')} style={props.style}>
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
                        ${props.user.theme === 'light' ? `
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
                    
                    img.bw-icon {
                        ${props.user.theme === 'light'
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
                                user={props.user} />
                    )
                }
                {props.secondaryLogo
                    ? <img src="/static/slate-logo.svg" id={css['secondary-logo']} className="bw-icon" />
                    : null
                }
                <Snackbar />
                <div id={css.container}>
                    {(() => {
                        const err = props.private && !props.user.isLoggedIn ? 404 : props.err;
                        switch (err) {
                            case 200:
                                return props.children;
                            case 404:
                                return (
                                    <div className={css['err-404']}>
                                        <h2>Error 404:</h2>
                                        <h1>This page could not be found.</h1>
                                    </div>
                                );
                            default:
                                return <div>Unknown error.</div>;
                        }
                    })()}
                </div>
            </div>
        );
    }
}

Layout.defaultProps = {
    className:   '',
    currentPage: '',
    err:         200,
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
