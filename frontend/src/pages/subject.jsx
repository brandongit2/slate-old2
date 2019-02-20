import Link from 'next/link';
import {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';

import {changeSubject, changeCourse, changeUnit, changeArticle, getSubject, getChildren} from '../actions';
import {Layout} from '../components';
import {contrasts} from '../util';
import css from './subject.scss';

function CourseInfo(props) {
    return (
        <div className={css['course-info']}>
            <p id={css.name}>{props.name}</p>
            <p id={css.description}>{props.description}</p>
        </div>
    );
}

function Subject(props) {
    // Boolean; whether white contrasts well with the subject color.
    const brightText = contrasts('ffffff', props.subject.color);
    return (
        <Layout currentPage=""
                title={props.subject.display_name + ' - Slate'}>
            <style jsx>{`
                --color: #${props.subject.color};
                --subject-text-color: ${brightText ? '#ffffff' : '#000000'};
                --secondary-subject-text-color: ${brightText ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 1)'};
                --tertiary-subject-text-color: ${brightText ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
                --title-color: ${brightText ? '#' + props.subjectColor : 'black'}
            `}</style>

            <div id={css.container}>
                <div id={css.info}>
                    <div id={css.breadcrumbs}>
                        <Link href="/subjects"><a>Subjects</a></Link>
                        <span className={css.arrow}>&gt;</span>
                        <span><b>{props.subject.display_name}</b></span>
                    </div>
                    <div>
                        <p id={css['label-subject']}>SUBJECT</p>
                        <p id={css.title}>{props.subject.display_name}</p>
                        <p id={css.description}>{props.subject.description}</p>
                    </div>
                </div>
                <div id={css['course-list']}>
                    <div>
                        <p id={css['courses-title']}>Courses</p>
                        {props.courses.map(course => (
                            <Link key={course.id}
                                  href={`/course?subject=${props.router.query.subject}&course=${course.id}`}
                                  as={`/subject/${props.subject.name}/${course.name}`}>
                                <a>
                                    <CourseInfo courseId={course.id}
                                                name={course.display_name}
                                                description={course.description} />
                                </a>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

Subject.getInitialProps = async ({store, query}) => {
    await store.dispatch(changeSubject(query.subject));
    await store.dispatch(changeCourse(null));
    await store.dispatch(changeUnit(null));
    await store.dispatch(changeArticle(null));
    await store.dispatch(getSubject(query.subject));
    await store.dispatch(getChildren('subject', query.subject));
};

function mapStateToProps(state) {
    return {
        subject: Object.values(state.subjects)[0],
        courses: state.courses,
        units:   state.units
    };
}

export default withRouter(connect(mapStateToProps)(Subject));
