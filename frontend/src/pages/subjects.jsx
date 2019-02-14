import moment from 'moment';
import Link from 'next/link';
import React from 'react';
import {connect} from 'react-redux';

import {changeSubject, changeCourse, getAllSubjects, getAllCourses, setInfo} from '../actions';
import {Layout} from '../components';
import {kebabToProper} from '../util';
import css from './subjects.scss';

function Subject(props) {
    return (
        <div className={css.subject}>
            <style jsx>{`
                --color: #${props.color}
            `}</style> {/* eslint-disable-line react/jsx-closing-tag-location */}
            <Link href={`/subject?subject=${props.id}`}
                  as={`/subject/${props.name}`}>
                <a className={css.title}>
                    {kebabToProper(props.name)}
                </a>
            </Link>
            {props.courses.map(course => (
                <Link key={course.name}
                      href={`/course?course=${course.id}`}
                      as={`/subject/${props.name}/${course.name}`}>
                    <a className={css.course}>
                        {kebabToProper(course.name)}
                    </a>
                </Link>
            ))}
        </div>
    );
}

Subject.defaultProps = {
    name:    '',
    color:   '888888',
    courses: []
};

function Courses(props) {
    return (
        <Layout currentPage="subjects"
                title="Subjects - Slate"
                className={css.layout}
                noShadow>
            <div id={css.container}>
                <span id={css.prompt}>What would you like to learn today?</span>
                <div id={css.courses}>
                    {Object.entries(props.subjects).map(([id, subject]) => (
                        <Subject key={id}
                                 id={id}
                                 name={subject.name}
                                 color={subject.color}
                                 courses={subject.courses.map(
                                     courseId => ({id: courseId, ...props.courses[courseId]})
                                 )} />
                         ))}
                </div>
            </div>
            <div id={css.footer}>
                <span>{props.info.version && props.info.publishDate
                    ? `Slate version ${props.info.version} published on ${moment.unix(props.info.publishDate).format('MMMM Do, YYYY')}.`
                    : props.info.version
                        ? `Slate version ${props.info.version}.`
                        : ''
                }</span> {/* eslint-disable-line react/jsx-closing-tag-location */}
                <span style={{float: 'right'}}>Made by <a href="https://github.com/brandongit2">Brandon Tsang</a>.</span>
            </div>
        </Layout>
    );
}

Courses.getInitialProps = async ({store}) => {
    await store.dispatch(getAllSubjects());
    await store.dispatch(getAllCourses());
    await store.dispatch(changeSubject(null));
    await store.dispatch(changeCourse(null));
    await store.dispatch(setInfo({
        version:     process.env.SLATE_VERSION,
        publishDate: process.env.SLATE_PUBLISH_DATE
    }));
};

function mapStateToProps(state) {
    return {
        courses:  state.courses,
        subjects: state.subjects,
        info:     state.info
    };
}

export default connect(mapStateToProps)(Courses);
