import moment from 'moment';
import React from 'react';
import {connect} from 'react-redux';

import {changeSubject, changeCourse, changeUnit, changeArticle, getAllSubjects, getAllCourses} from '../actions';
import {Layout} from '../components';

import css from './landing.scss';

function Landing(props) {
    return (
        <Layout title="Slate" landingPage {...props}>
            <div className={css.subjects}>
                <main>
                    <div className={css.hero}>
                        <div className={css.text}>
                            <p className={css['big-text']}>Get learning.</p>
                            <p className={css.desc}>
                                Slate is an online source of free, intuitive, and interactive articles on subjects ranging from mathematics to computer science.
                            </p>
                        </div>
                        <img className={css.earth} src="/static/earth.png" />
                    </div>
                </main>
                <footer>
                    <span>{props.info.version && props.info.publishDate
                        ? `Slate version ${props.info.version} published on ${moment.unix(props.info.publishDate).format('MMMM Do, YYYY')}.`
                        : props.info.version
                            ? `Slate version ${props.info.version}.`
                            : ''
                    }</span>
                    <span style={{float: 'right'}}>
                        Made by <a href="https://github.com/brandongit2">Brandon Tsang</a>.
                    </span>
                </footer>
            </div>
        </Layout>
    );
}

Landing.getInitialProps = async ({store}) => {
    await store.dispatch(changeSubject(null));
    await store.dispatch(changeCourse(null));
    await store.dispatch(changeUnit(null));
    await store.dispatch(changeArticle(null));
    await store.dispatch(getAllSubjects());
    await store.dispatch(getAllCourses());
};

function mapStateToProps(state) {
    return {
        subjects: state.subjects,
        courses:  state.courses,
        info:     state.info
    };
}

export default connect(mapStateToProps)(Landing);
