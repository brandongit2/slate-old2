import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import React from 'react';
import {connect} from 'react-redux';

import {changeSubject, changeCourse, changeUnit, changeArticle, getAllSubjects, getAllCourses, getChildren, setInfo} from '../actions';
import {Layout} from '../components';
import {apiPrefix1, apiPrefix2} from '../constants';
import css from './subjects.scss';

const apiPrefix = process.env ? apiPrefix2 : apiPrefix1;

function Subject(props) {
    const [courses, setCourses] = React.useState([]);
    
    props.courses.then(courses => setCourses(courses.data));
    
    return (
        <div className={css.subject}>
            <style jsx>{`
                --color: #${props.color}
            `}</style> {/* eslint-disable-line react/jsx-closing-tag-location */}
            <Link href={`/subject?subject=${props.id}`}
                  as={`/subject/${props.name}`}>
                <a className={css.title}>
                    {props.displayName}
                </a>
            </Link>
            {courses.map(course => (
                <Link key={course.name}
                      href={`/course?course=${course.id}`}
                      as={`/subject/${props.name}/${course.name}`}>
                    <a className={css.course}>
                        {course.display_name}
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
                    {props.subjects.map(subject => (
                        <Subject key={subject.id}
                                 id={subject.id}
                                 name={subject.name}
                                 displayName={subject.display_name}
                                 color={subject.color}
                                 courses={axios.get(apiPrefix + '/children?subject=' + subject.id)} />
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
    await store.dispatch(changeSubject(null));
    await store.dispatch(changeCourse(null));
    await store.dispatch(changeUnit(null));
    await store.dispatch(changeArticle(null));
    await store.dispatch(getAllSubjects());
    await store.dispatch(getAllCourses());
    await store.dispatch(setInfo({
        version:     process.env.SLATE_VERSION,
        publishDate: process.env.SLATE_PUBLISH_DATE
    }));
};

function mapStateToProps(state) {
    return {
        subjects: state.subjects,
        courses:  state.courses,
        info:     state.info
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getCoursesBySubject: subjectId => dispatch(getChildren('subject', subjectId))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Courses);
