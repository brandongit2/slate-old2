/*
 * Wrap pages in this component in order to have page titles and headers.
 */

import Head from 'next/head';
import React from 'react';

const layoutStyles = {
    width:  '100vw',
    height: '100vh'
};

const Layout = props => (
    <div className={props.className} style={Object.assign(layoutStyles, props.style)}>
        <Head>
            <title>{props.title}</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <style jsx global>{`
            @import url('https://fonts.googleapis.com/css?family=Lato:100,300,400,700,900');

            body {
                margin: 0;
            }

            p, span, h1, h2, h3, h4, h5, h6, input, textarea, button, div {
                font-family: 'Lato', sans-serif;
            }
        `}</style> {/* eslint-disable-line react/jsx-closing-tag-location */}
        {props.children}
    </div>
);

Layout.defaultProps = {
    className: '',
    style:     {},
    title:     'Slate'
};

export default Layout;
