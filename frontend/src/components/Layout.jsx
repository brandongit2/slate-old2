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
        <style jsx global>{`
            @import url('https://fonts.googleapis.com/css?family=Lato:100,300,400,700,900');
            @import url('https://fonts.googleapis.com/icon?family=Material+Icons');

            :root {
                --text-color: #000;
                --secondary-text-color: #666;
                --tertiary-text-color: #999;
            }

            body {
                margin: 0;
            }

            p, a, span, h1, h2, h3, h4, h5, h6, input, textarea, button, div {
                font-family: 'Lato', sans-serif;
                margin: 0;
            }

            p::selection, a::selection, span::selection, h1::selection, h2::selection, h3::selection, h4::selection,
            h5::selection, h6::selection, input::selection, textarea::selection, div::selection {
                background: var(--text-color);
                color: white;
            }

            a {
                cursor: pointer;
            }

            input {
                padding: 10px;
                font-size: 12pt;
                border: 1px solid grey;
                border-radius: 5px;
                outline: none;
            }

            input:focus {
                border: 1px solid #0478f1;
                box-shadow: 0px 0px 2px 0px #0478f1;
            }

            button, input[type='submit'] {
                padding: 10px 20px;
                font-weight: 700;
                font-size: 12pt;
                background: #0478f1;
                border: none;
                color: white;
                border-radius: 5px;
                outline: none;
                transition: box-shadow 0.2s;
            }

            button:hover, input[type='submit']:hover {
                box-shadow: 0px 0px 15px 0px rgb(4, 120, 241, 0.5);
            }

            button:active, input[type='submit']:active {
                background: #0056af;
            }

            label {
                cursor: text;
            }
        `}</style> {/* eslint-disable-line react/jsx-closing-tag-location */}
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
