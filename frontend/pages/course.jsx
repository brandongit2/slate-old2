import Link from 'next/link';
import {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';

import {changeSubject, changeCourse, changeUnit, changeArticle, getSubject, getCourse, getChildren} from '../actions';
import {Layout, Breadcrumbs, Dropdown, ContentContainer} from '../components';
import {Crumb} from '../components/Breadcrumbs';
import {Item} from '../components/Dropdown';
import {InfoSection, ContentSection} from '../components/ContentContainer';

import css from './course.scss';

function Course(props) {
    return (
        <Layout title={`${props.course.display_name} - Slate`} {...props}>
            <ContentContainer color={`#${props.subject.color}`}>
                <InfoSection breadcrumbs={(
                                 <div className={css.breadcrumbs}> {/* eslint-disable-line react/jsx-indent */}
                                     <Breadcrumbs>
                                         <Crumb>
                                             <Link href="/subjects">
                                                 <a>Subjects</a>
                                             </Link>
                                         </Crumb>
                                         <Crumb>
                                             <Link href={`/subject/${props.subject.name}`}>
                                                 <a>{props.subject.display_name}</a>
                                             </Link>
                                         </Crumb>
                                         <Crumb>
                                             <Dropdown mini label={props.course.display_name}>
                                                 {props.courses.map(course => (
                                                     <Item key={course.id}
                                                           onClick={() => {
                                                               props.dispatch(changeCourse(course.id));
                                                               props.dispatch(getChildren('course', course.id));
                                                               
                                                               const url = `/subject/${props.subject.name}/${course.name}`;
                                                               const as = url;
                                                               const options = {};
                                                               window.history.pushState({url, as, options}, null, url);
                                                           }}>
                                                         {course.display_name}
                                                     </Item>
                                                 ))}
                                             </Dropdown>
                                         </Crumb>
                                     </Breadcrumbs>
                                 </div>
                             )}
                             type="Course"
                             title={props.course.display_name}
                             description={props.course.description} />
                <ContentSection>
                    <main className={css['content-section']}>
                        <p id={css['units-title']}>Units</p>
                        {props.units.map(unit => (
                            <div key={unit.id} className={css['article-list']}>
                                <div id={css['unit-header']}>
                                    <span className={css['unit-number']}>Unit {unit.order}</span>
                                    <span>{unit.display_name}</span>
                                </div>
                                <div id={css.list}>
                                    {props.articles.map(article => {
                                        if (article.unit_id === unit.id) {
                                            return (
                                                <Link key={article.id}
                                                      href={
                                                          `/article?subject=${props.subject.id}&course=${props.course.id}&unit=${unit.id}&article=${article.id}`
                                                      }
                                                      as={
                                                          `/subject/${props.subject.name}/${props.course.name}/${article.title}`
                                                      }>
                                                    <a>{article.display_title}</a>
                                                </Link>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        ))}
                    </main>
                </ContentSection>
            </ContentContainer>
        </Layout>
    );
}

Course.getInitialProps = ({store, query}) => {
    store.dispatch(changeSubject(query.subject));
    store.dispatch(changeCourse(query.course));
    store.dispatch(changeUnit(null));
    store.dispatch(changeArticle(null));
    store.dispatch(getSubject(query.subject));
    store.dispatch(getCourse(query.course));
    store.dispatch(getChildren('subject', query.subject));
    store.dispatch(getChildren('course', query.course));
    store.dispatch(getChildren('course', query.course, 'articles'));
};

function mapStateToProps(state) {
    return {
        subject:  state.subjects.find(subject => subject.id === parseInt(state.currentSubject)),
        course:   state.courses.find(course => course.id === parseInt(state.currentCourse)),
        courses:  state.courses,
        units:    state.units,
        articles: state.articles,
        user:     state.user
    };
}

export default withRouter(connect(mapStateToProps)(Course));
