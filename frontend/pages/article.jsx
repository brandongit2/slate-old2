import moment from 'moment';
import Link from 'next/link';
import React from 'react';
import {connect} from 'react-redux';

import {changeSubject, changeCourse, changeUnit, changeArticle, getSubject, getCourse, getUnit, getArticleContent, getChildren} from '../actions';
import {Layout, Breadcrumbs, Crumb, Dropdown, Item} from '../components';

import css from './article.scss';

function Article(props) {
    return (
        <Layout title={props.article?.display_title + ' - Slate'} {...props}>
            <div className={css.article}>
                <Breadcrumbs>
                    <Crumb><Link href="/subjects">
                        <a>Subjects</a>
                    </Link></Crumb>
                    <Crumb><Link href={'/subject/' + props.subject?.name}>
                        <a>{props.subject?.display_name}</a>
                    </Link></Crumb>
                    <Crumb><Link href={'/subject/' + props.subject?.name + '/' + props.course?.name}>
                        <a>{props.course?.display_name}</a>
                    </Link></Crumb>
                    <Crumb>
                        <Dropdown label={props.article?.display_title} mini>{
                            props.articles ? props.articles.map(article => (
                                <Item key={article.id}
                                      onClick={() => {
                                          props.dispatch(changeArticle(article.id));
                                          window.history.pushState(
                                              {}, '',
                                              `/subject/${props.subject.name}/${props.course.name}/${article.title}`
                                          );
                                      }}>
                                    {article.display_title}
                                </Item>
                            )) : null
                        }</Dropdown>
                    </Crumb>
                </Breadcrumbs>
                <div id={css.article}>
                    <div id={css.head}>
                        <p id={css.title}>{props.article?.display_title}</p>
                        <div id={css.date}>
                            <p>Published {
                                moment(props.article?.publish_date).calendar(null, {sameElse: '[on] MMMM Do, YYYY'})
                            }</p>
                            <p>Last updated {
                                moment(props.article?.update_date).calendar(null, {sameElse: '[on] MMMM Do, YYYY'})
                            }</p>
                        </div>
                    </div>
                    {/* eslint-disable-next-line react/no-danger */}
                    <div id={css.body} dangerouslySetInnerHTML={{__html: props.article?.content}}>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

Article.getInitialProps = async ({store, query}) => {
    await store.dispatch(changeSubject(query.subject));
    await store.dispatch(changeCourse(query.course));
    await store.dispatch(changeUnit(query.unit));
    await store.dispatch(changeArticle(query.article));
    
    await store.dispatch(getSubject(query.subject));
    await store.dispatch(getCourse(query.course));
    await store.dispatch(getUnit(query.unit));
    await store.dispatch(getChildren('unit', query.unit));
    await store.dispatch(getArticleContent(query.article));
};

function mapStateToProps(state) {
    return {
        subject:  state.subjects.find(subject => subject.id === parseInt(state.currentSubject)),
        course:   state.courses.find(course => course.id === parseInt(state.currentCourse)),
        unit:     state.units.find(unit => unit.id === parseInt(state.currentUnit)),
        article:  state.articles.find(article => article.id === parseInt(state.currentArticle)),
        articles: state.articles
    };
}

export default connect(mapStateToProps)(Article);
