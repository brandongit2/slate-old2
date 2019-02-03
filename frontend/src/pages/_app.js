import App, {Container} from 'next/app';
import withRedux from 'next-redux-wrapper';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import {getCourses} from '../actions';
import rootReducer from '../reducers';

const makeStore = initialState => createStore(
    rootReducer,
    initialState,
    typeof window !== 'undefined'
        ? composeWithDevTools(applyMiddleware(thunk))
        : applyMiddleware(thunk)
);

export default withRedux(makeStore)(class Slate extends App {
    static async getInitialProps({Component, ctx}) {
        ctx.store.dispatch(getCourses());
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