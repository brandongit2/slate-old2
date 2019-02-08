import Link from 'next/link';
import {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';

import {changeSubject, getSubject, getCoursesBySubject, getUnitsBySubject} from '../actions';
import {Layout, CourseInfo} from '../components';
import {kebabToProper, contrasts} from '../util';
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
        const brightText = contrasts('ffffff', props.subject.color);
        return (
            <Layout currentPage=""
                    title={kebabToProper(props.subject.name) + ' - Slate'}
                    headerColor={'#' + props.subject.color}>
                <style jsx>{`
                    --color: #${props.subject.color};
                    --subject-text-color: ${brightText ? '#ffffff' : '#000000'};
                    --secondary-subject-text-color: ${brightText ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 1)'};
                    --tertiary-subject-text-color: ${brightText ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
                    --title-color: ${brightText ? '#' + props.subjectColor : 'black'}
                `}</style> {/* eslint-disable-line react/jsx-closing-tag-location */}

                <div id={css.container}>
                    <div id={css.info}>
                        <div id={css.breadcrumbs}>
                            <Link href="/subjects"><a>Subjects</a></Link>
                            <span className={css.arrow}>&gt;</span>
                            <span>{kebabToProper(props.subject.name)}</span>
                        </div>
                        <div>
                            <p id={css['label-subject']}>SUBJECT</p>
                            <p id={css.title}>{kebabToProper(props.subject.name)}</p>
                            <p id={css.description}>{props.subject.description}</p>
                        </div>
                    </div>
                    <div id={css['course-list']}>
                        <div>
                            <p id={css['courses-title']}>Courses</p>
                            {(Object.entries(props.courses) || []).map(([id, course]) => (
                                <Link key={id}
                                      href={`/course?subject=${props.router.query.subject}&course=${id}`}
                                      as={`/subject/${props.subject.name}/${course.name}`}>
                                    <a>
                                        <CourseInfo courseId={id}
                                                    name={kebabToProper(course.name)}
                                                    description={course.description}
                                                    units={course.units.map(unitId => props.units[unitId])} />
                                    </a>
                                </Link>
                            ))}
                        </div>
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
