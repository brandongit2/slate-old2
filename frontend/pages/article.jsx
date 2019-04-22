import moment from 'moment';
import Link from 'next/link';
import React from 'react';
import {connect} from 'react-redux';

import {changeSubject, changeCourse, changeUnit, changeArticle, getSubject, getCourse, getUnit, getArticleContent, getChildren} from '../actions';
import {Layout, Breadcrumbs, Dropdown} from '../components';
import {Crumb} from '../components/Breadcrumbs';
import {Item} from '../components/Dropdown';

import css from './article.scss';

function Article(props) {
    return (
        <Layout title={`${props.article.display_title} - Slate`} {...props}>
            <div className={css.article}>
                <Breadcrumbs>
                    <Crumb><Link href="/subjects"><a>Subjects</a></Link></Crumb>
                    <Crumb><Link href={`/subject/${props.subject.name}`}>
                        <a>{props.subject.display_name}</a>
                    </Link></Crumb>
                    <Crumb>
                        <Link href={`/subject/${props.subject.name}/${props.course.name}`}>
                            <a>{props.course.display_name}</a>
                        </Link>
                    </Crumb>
                    <Crumb>
                        <Dropdown label={props.article.display_title} mini>
                            {props.articles.map(article => (
                                <Item key={article.id}
                                      onClick={() => {
                                          props.dispatch(changeArticle(article.id));
                                          props.dispatch(getArticleContent(article.id));
                                          
                                          const url = `/subject/${props.subject.name}/${props.course.name}/${article.title}`;
                                          const as = url;
                                          const options = {};
                                          window.history.pushState({url, as, options}, null, url);
                                      }}>
                                    {article.display_title}
                                </Item>
                            ))}
                        </Dropdown>
                    </Crumb>
                </Breadcrumbs>
                <main>
                    <div id={css.head}>
                        <h1>{props.article.display_title}</h1>
                        <div id={css.date}>
                            <p>
                                Published&nbsp;
                                <time dateTime={props.article.publish_date}>
                                    {moment(props.article.publish_date)
                                        .calendar(null, {sameElse: '[on] MMMM Do, YYYY'})}
                                </time>
                            </p>
                            <p>
                                Last updated&nbsp;
                                <time dateTime={props.article.update_date}>
                                    {moment(props.article.update_date)
                                        .calendar(null, {sameElse: '[on] MMMM Do, YYYY'})}
                                </time>
                            </p>
                        </div>
                    </div>
                    {/* eslint-disable-next-line react/no-danger */}
                    <article dangerouslySetInnerHTML={{__html: props.article.content}} />
                </main>
            </div>
        </Layout>
    );
}

Article.getInitialProps = ({store, query}) => {
    store.dispatch(changeSubject(query.subject));
    store.dispatch(changeCourse(query.course));
    store.dispatch(changeUnit(query.unit));
    store.dispatch(changeArticle(query.article));
    
    store.dispatch(getSubject(query.subject));
    store.dispatch(getCourse(query.course));
    store.dispatch(getUnit(query.unit));
    store.dispatch(getChildren('unit', query.unit));
    store.dispatch(getArticleContent(query.article));
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
