import moment from 'moment';
import React from 'react';
import {connect} from 'react-redux';

import {Layout} from '../components';

import css from './landing.scss';

function Landing(props) {
    return (
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
                    <span>{props.info.version && props.info.publishDate
                        ? `Slate version ${props.info.version} published on ${moment.unix(props.info.publishDate).format('MMMM Do, YYYY')}.`
                        : (
                            props.info.version
                                ? `Slate version ${props.info.version}.`
                                : ''
                        )
                    }</span>
                    <span style={{float: 'right'}}>
                        Made by <a href="https://github.com/brandongit2">Brandon Tsang</a>.
                    </span>
                </footer>
            </div>
        </Layout>
    );
}

function mapStateToProps(state) {
    return {
        info: state.info
    };
}

export default connect(mapStateToProps)(Landing);
