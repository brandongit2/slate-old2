import moment from 'moment';
import React from 'react';

import {Layout} from '../components';
import {SlateInfoContext} from '../contexts';

import css from './landing.scss';

export default function Landing(props) {
    return (
        <SlateInfoContext.Consumer>
            {slateInfo => (
                <Layout title="Slate: Free, interactive articles on STEM subjects." landingPage {...props}>
                    <div className={css.subjects}>
                        <main>
                            <div className={css.hero}>
                                <div className={css.text}>
                                    <p className={css['big-text']}>Get learning.</p>
                                    <p className={css.desc}>
                                        Slate is an online source of free, intuitive, and interactive articles on subjects ranging from biology to computer science.
                                    </p>
                                </div>
                                <img className={css.earth} src="/static/earth.png" />
                            </div>
                        </main>
                        <footer>
                            <span>
                                Slate version {slateInfo.version} published on {moment.unix(slateInfo.publishDate).format('MMMM Do, YYYY')}.
                            </span>
                            <span style={{float: 'right'}}>
                                Made by <a href="https://github.com/brandongit2">Brandon Tsang</a>.
                            </span>
                        </footer>
                    </div>
                </Layout>
            )}
        </SlateInfoContext.Consumer>
    );
}
