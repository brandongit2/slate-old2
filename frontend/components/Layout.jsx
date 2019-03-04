/*
 * Wrap pages in this component in order to have page titles and headers.
 */

import Head from 'next/head';
import React from 'react';
import {connect} from 'react-redux';

import {Header, Modal, Snackbar} from './';

import css from './Layout.scss';

const layoutStyles = {
    width:  '100vw',
    height: '100vh'
};

function Layout(props) {
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
                            user={props.user} />
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

export default connect(mapStateToProps)(Layout);
