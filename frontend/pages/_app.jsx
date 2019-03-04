import axios from 'axios';
import NextApp, {Container} from 'next/app';
import Router from 'next/router';
import withRedux from 'next-redux-wrapper';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import {logIn, setInfo} from '../actions';
import {rootUrl} from '../constants';
import rootReducer from '../reducers';

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
        
        console.log(Object.keys(ctx.req.cookies));
        // const user = (await axios.post('/api/log-in', {cookie: })).data.user;
        // console.log(user);
        
        const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
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
