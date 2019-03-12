import Color from 'color';
import Link from 'next/link';
import Router, {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';

import {changeSubject, changeCourse, changeUnit, changeArticle, getAllSubjects, getChildren} from '../actions';
import {Layout, Breadcrumbs, Crumb, Dropdown, Item} from '../components';
import {rgb} from '../util';

import css from './subject.scss';

function Subject(props) {
    const lightTheme = props.user.theme === 'light';
    const subjectColor = lightTheme
        ? (props.subject
            ? Color('#' + props.subject.color)
            : Color('#ffffff'))
        : (props.subject
            ? Color('#' + props.subject.color)
            : Color('#000000'));
    return (
        <Layout title={props.subject?.display_name + ' - Slate'} {...props}>
            <style jsx>{`
                --subject-color: ${rgb(subjectColor.rgb().array())};
                --subject-background-color: ${lightTheme ? rgb(subjectColor.rgb().array()) : '#000'};
                --subject-text-color: ${
                    lightTheme
                        ? (subjectColor.isLight() ? '#000' : '#fff')
                        : rgb(subjectColor.rgb().array())
                };
                --secondary-subject-text-color: ${
                    lightTheme
                        ? (subjectColor.isLight() ? '#00000bb' : '#ffffffbb')
                        : '#ffffffaa'
                };
                --tertiary-subject-text-color: ${
                    lightTheme
                        ? (subjectColor.isLight() ? '#00000088' : '#ffffff88')
                        : 'ffffff77'
                };
            `}</style>

            <div className={css.subject}>
                <div id={css.info}>
                    <Breadcrumbs>
                        <Crumb><Link href="/subjects"><a>Subjects</a></Link></Crumb>
                        <Crumb>
                            <Dropdown mini label={props.subject?.display_name}>
                                {props ? props.subjects.map(subject => (
                                    <Item key={subject.id}
                                          onClick={() => {
                                              props.dispatch(changeSubject(subject.id));
                                              props.dispatch(getChildren('subject', subject.id));
                                              Router.push('/subject?subject=' + subject.id, '/subject/' + subject.name, {shallow: true});
                                          }}>{subject.display_name}</Item>
                                  )) : null}
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
                        {props.courses ? props.courses.map(course => (
                            <Link key={course.id}
                                  href={'/course?subject=' + props.subject?.id + '&course=' + course.id}
                                  as={'/subject/' + props.subject?.name + '/' + course.name}>
                                <a>
                                    <div className={css['course-info']}>
                                        <p id={css.name}>{course.display_name}</p>
                                        <p id={css.description}>{course.description}</p>
                                    </div>
                                </a>
                            </Link>
                        )) : null}
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
        units:    state.units,
        user:     state.user
    };
}

export default withRouter(connect(mapStateToProps)(Subject));
