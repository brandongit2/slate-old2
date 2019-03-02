import axios from 'axios';
import NextApp, {Container} from 'next/app';
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

export default withRedux(makeStore)(class Slate extends NextApp {
    static async getInitialProps({Component, ctx}) {
        axios.defaults.baseUrl = rootUrl;
        if (typeof window !== 'undefined') {
            axios.defaults.headers.common['Authorization'] = window.localStorage.getItem('authToken');
        }
        await ctx.store.dispatch(setInfo({
            version:     process.env.SLATE_VERSION,
            publishDate: process.env.SLATE_PUBLISH_DATE
        }));
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
