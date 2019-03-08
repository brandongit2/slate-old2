import axios from 'axios';
import NextApp, {Container} from 'next/app';
import Router from 'next/router';
import withRedux from 'next-redux-wrapper';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import {setInfo} from '../actions';
import rootReducer from '../reducers';

import {rootUrl} from '../config.json';

import './_app.scss';

function makeStore(initialState) {
    return createStore(
        rootReducer,
        initialState,
        composeWithDevTools(applyMiddleware(thunk))
    );
}

// https://github.com/zeit/next-plugins/issues/282#issuecomment-432127816
Router.events.on('routeChangeComplete', () => {
    if (process.env.NODE_ENV !== 'production') {
        const els = document.querySelectorAll('link[href*="/_next/static/css/styles.chunk.css"]');
        const timestamp = new Date().valueOf();
        els[0].href = '/_next/static/css/styles.chunk.css?v=' + timestamp;
    }
});

export default withRedux(makeStore)(class Slate extends NextApp {
    static async getInitialProps({Component, ctx}) {
        axios.defaults.baseUrl = rootUrl;
        
        await ctx.store.dispatch(setInfo({
            version:     process.env.version,
            publishDate: process.env.publishDate
        }));
        
        let pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
        if (pageProps == null) pageProps = {};
        
        if (ctx.req) {
            let user = (await axios.request({
                url:     '/api/authenticate',
                method:  'post',
                headers: {
                    Cookie: `authToken=${ctx.req.cookies.authToken};`
                }
            })).data;
            if (user.success) {
                user = {
                    isLoggedIn:     true,
                    id:             user.user.id,
                    first_name:     user.user.first_name,
                    last_name:      user.user.last_name,
                    email:          user.user.email,
                    valid_email:    user.user.valid_email,
                    permissions:    user.user.permissions,
                    password_reset: user.user.password_reset,
                    theme:          user.user.theme
                };
            } else {
                user = {isLoggedIn: false};
            }
            
            Object.assign(pageProps, {altUser: user});
        }
        
        return {pageProps};
    }

    render() {
        const {Component, pageProps, store} = this.props;
        return (
            <Container>
                <Provider store={store}>
                    <Component {...pageProps} />
                </Provider>
            </Container>
        );
    }
});
