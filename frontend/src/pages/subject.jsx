import {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';

import {changeSubject, getCoursesBySubject} from '../actions';
import {Layout} from '../components';
import {kebabToProper} from '../util';
import css from './subject.scss';

class Subject extends React.Component {
    static async getInitialProps({store, query}) {
        await store.dispatch(changeSubject(query.subject));
        await store.dispatch(getCoursesBySubject(query.subject));
    }

    render() {
        const {props} = this;
        return (
            <Layout currentPage=""
                    title={kebabToProper(props.subject.name) + ' - Slate'}>
                <style jsx>{`
                    --color: #${props.subject.color};
                `}</style> {/* eslint-disable-line react/jsx-closing-tag-location */}
                <div id={css.container}>
                    <div id={css.info}>
                        <p id={css['label-courses']}>SUBJECT</p>
                        <p id={css.title}>{kebabToProper(props.subject.name)}</p>
                    </div>
                    <div id={css['course-list']}>
                        {Object.entries(props.courses).map(([id, course]) => (
                            <p key={id}>{kebabToProper(course.name)}</p>
                        ))}
                    </div>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps = state => ({
    subject: state.subjects[state.currentSubject],
    courses: state.currentCourses
});

export default withRouter(connect(mapStateToProps)(Subject));
