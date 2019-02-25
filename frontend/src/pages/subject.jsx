import Link from 'next/link';
import Router, {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';

import {changeSubject, changeCourse, changeUnit, changeArticle, getAllSubjects, getChildren} from '../actions';
import {Layout, Breadcrumbs, Crumb, Dropdown, Item} from '../components';
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
    const brightText = contrasts('ffffff', props.subject?.color);
    return (
        <Layout currentPage=""
                title={props.subject?.display_name + ' - Slate'}>
            <style jsx>{`
                --color: #${props.subject ? props.subject.color : 'fff'};
                --subject-text-color: ${brightText ? '#ffffff' : '#000000'};
                --secondary-subject-text-color: ${brightText ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 1)'};
                --tertiary-subject-text-color: ${brightText ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
                --title-color: ${brightText ? '#' + props.subjectColor : 'black'}
            `}</style>

            <div id={css.container}>
                <div id={css.info}>
                    <Breadcrumbs>
                        <Crumb><Link href="/subjects"><a>Subjects</a></Link></Crumb>
                        <Crumb>
                            <Dropdown mini label={props.subject?.display_name}>
                                {props.subjects.map(subject => (
                                    <Item key={subject.id}
                                          onClick={() => {
                                              props.dispatch(changeSubject(subject.id));
                                              props.dispatch(getChildren('subject', subject.id));
                                              Router.push('/subject?subject=' + subject.id, '/subject/' + subject.name, {shallow: true});
                                          }}>{subject.display_name}</Item>
                                ))}
                            </Dropdown>
                        </Crumb>
                    </Breadcrumbs>
                    <div>
                        <p id={css['label-subject']}>SUBJECT</p>
                        <p id={css.title}>{props.subject?.display_name}</p>
                        <p id={css.description}>{props.subject?.description}</p>
                    </div>
                </div>
                <div id={css['course-list']}>
                    <div>
                        <p id={css['courses-title']}>Courses</p>
                        {props.courses.map(course => (
                            <Link key={course.id}
                                  href={'/course?subject=' + props.subject.id + '&course=' + course.id}
                                  as={'/subject/' + props.subject?.name + '/' + course.name}>
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
    await store.dispatch(getAllSubjects());
    await store.dispatch(getChildren('subject', query.subject));
};

function mapStateToProps(state) {
    return {
        subject:  state.subjects.find(subject => subject.id === parseInt(state.currentSubject)),
        subjects: state.subjects,
        courses:  state.courses,
        units:    state.units
    };
}

export default withRouter(connect(mapStateToProps)(Subject));
