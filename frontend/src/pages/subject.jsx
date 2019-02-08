import {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';

import {changeSubject, getSubject, getCoursesBySubject, getUnitsBySubject} from '../actions';
import {Layout, CourseInfo} from '../components';
import {kebabToProper} from '../util';
import css from './subject.scss';

class Subject extends React.Component {
    static async getInitialProps({store, query}) {
        await store.dispatch(changeSubject(query.subject));
        await store.dispatch(getSubject(query.subject));
        await store.dispatch(getCoursesBySubject(query.subject));
        await store.dispatch(getUnitsBySubject(query.subject));
    }

    render() {
        const {props} = this;
        return (
            <Layout currentPage=""
                    title={kebabToProper(props.subject.name) + ' - Slate'}
                    headerColor={'#' + props.subject.color}>
                <style jsx>{`
                    --color: #${props.subject.color};
                `}</style> {/* eslint-disable-line react/jsx-closing-tag-location */}

                <div id={css.container}>
                    <div id={css.info}>
                        <div>
                            <p id={css['label-courses']}>SUBJECT</p>
                            <p id={css.title}>{kebabToProper(props.subject.name)}</p>
                            <p id={css.description}>{props.subject.description}</p>
                        </div>
                    </div>
                    <div id={css['course-list']}>
                        <p id={css['courses-title']}>Courses</p>
                        {Object.entries(props.courses).map(([id, course]) => (
                            <CourseInfo key={id}
                                        courseId={id}
                                        name={kebabToProper(course.name)}
                                        description={course.description}
                                        units={course.units.map(unitId => props.units[unitId])} />
                        ))}
                    </div>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps = state => ({
    subject: Object.values(state.subjects)[0],
    courses: state.courses,
    units:   state.units
});

export default withRouter(connect(mapStateToProps)(Subject));
