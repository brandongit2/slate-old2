import moment from 'moment';
import Link from 'next/link';
import React from 'react';
import {connect} from 'react-redux';

import {changeSubject, changeCourse, changeUnit, changeArticle, getAllSubjects, getAllCourses} from '../actions';
import {Layout} from '../components';

import css from './subjects.scss';

function Subjects(props) {
    return (
        <Layout currentPage="subjects" title="Subjects - Slate" noShadow {...props}>
            <main className={css.subjects}>
                <span id={css.prompt}>What would you like to learn today?</span>
                <div id={css.courses}>
                    {props.subjects.map(subject => (
                        <div className={css.subject} key={subject.id}>
                            <style jsx>{`
                                --color: #${subject.color}
                            `}</style>
                            <Link href={`/subject?subject=${subject.id}`}
                                  as={`/subject/${subject.name}`}>
                                <a className={css.title}>
                                    {subject.display_name}
                                </a>
                            </Link>
                            {props.courses.filter(course => course.subject_id === subject.id).map(course => (
                                <Link key={course.name}
                                      href={`/course?subject=${subject.id}&course=${course.id}`}
                                      as={`/subject/${subject.name}/${course.name}`}>
                                    <a className={css.course}>
                                        {course.display_name}
                                    </a>
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>
            </main>
            <div id={css.footer}>
                <span>{props.info.version && props.info.publishDate
                    ? `Slate version ${props.info.version} published on ${moment.unix(props.info.publishDate).format('MMMM Do, YYYY')}.`
                    : props.info.version
                        ? `Slate version ${props.info.version}.`
                        : ''
                }</span>
                <span style={{float: 'right'}}>
                    Made by <a href="https://github.com/brandongit2">Brandon Tsang</a>.
                </span>
            </div>
        </Layout>
    );
}

Subjects.getInitialProps = async ({store}) => {
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

export default connect(mapStateToProps)(Subjects);
