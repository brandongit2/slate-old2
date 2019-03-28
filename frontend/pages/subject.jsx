import Link from 'next/link';
import {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';

import {changeSubject, changeCourse, changeUnit, changeArticle, getAllSubjects, getChildren} from '../actions';
import {Layout, Breadcrumbs, Crumb, Dropdown, Item, ContentContainer, InfoSection, ContentSection} from '../components';

import css from './subject.scss';

function Subject(props) {
    return (
        <Layout title={props.subject ? props.subject.display_name + ' - Slate' : 'Slate'} {...props}>
            <ContentContainer color={props.subject ? `#${props.subject.color}` : '#ffffff'}>
                <InfoSection breadcrumbs={(
                                 <div className={css.breadcrumbs}> {/* eslint-disable-line react/jsx-indent */}
                                     <Breadcrumbs>
                                         <Crumb><Link href="/subjects"><a>Subjects</a></Link></Crumb>
                                         <Crumb>
                                             <Dropdown mini label={props.subject ? props.subject.display_name : ''}>
                                                 {props ? props.subjects.map(subject => (
                                                     <Item key={subject.id}
                                                           onClick={() => {
                                                               props.dispatch(changeSubject(subject.id));
                                                               props.dispatch(getChildren('subject', subject.id));
                                                               window.history.pushState({}, '', '/subject/' + subject.name);
                                                           }}>{subject.display_name}</Item>
                                                   )) : null}
                                             </Dropdown>
                                         </Crumb>
                                     </Breadcrumbs>
                                 </div>
                             )}
                             type="Subject"
                             title={props.subject ? props.subject.display_name : ''}
                             description={props.subject ? props.subject.description : ''} />
                <ContentSection>
                    <main className={css['course-list']}>
                        <p id={css['courses-title']}>Courses</p>
                        {props.courses ? props.courses.map(course => (
                            <Link key={course.id}
                                  href={props.subject ? (
                                      '/course?subject=' + props.subject.id + '&course=' + course.id
                                  ) : ''}
                                  as={props.subject ? ('/subject/' + props.subject.name + '/' + course.name) : ''}>
                                <a>
                                    <div className={css['course-info']}>
                                        <p id={css.name}>{course.display_name}</p>
                                        <p id={css.description}>{course.description}</p>
                                    </div>
                                </a>
                            </Link>
                        )) : null}
                    </main>
                </ContentSection>
            </ContentContainer>
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
