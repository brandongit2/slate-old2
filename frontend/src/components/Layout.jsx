/*
 * Wrap pages in this component in order to have page titles and headers.
 */

import Head from 'next/head';
import React from 'react';

import {Header, Snackbar} from './';
import css from './Layout.scss';

const layoutStyles = {
    width:  '100vw',
    height: '100vh'
};

const Layout = props => (
    <div className={props.className}
         id={css.layout}
         style={Object.assign(layoutStyles, props.style)}>
        <Head>
            <title>{props.title}</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel="shortcut icon" href="/static/favicon.png" />
        </Head>
        {props.noHeader
            ? null
            : (
                <Header currentPage={props.currentPage}
                        float={props.headerFloat}
                        noShadow={props.noShadow} />
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

Layout.defaultProps = {
    className:   '',
    headerFloat: false,
    style:       {},
    title:       'Slate'
};

export default Layout;
