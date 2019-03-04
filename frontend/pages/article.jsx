import moment from 'moment';
import Link from 'next/link';
import Router from 'next/router';
import React from 'react';
import {connect} from 'react-redux';

import {changeSubject, changeCourse, changeUnit, changeArticle, getSubject, getCourse, getUnit, getArticle, getChildren} from '../actions';
import {Layout, Breadcrumbs, Crumb, Dropdown, Item} from '../components';

import css from './article.scss';

function Article(props) {
    return (
        <Layout title={props.article?.display_title + ' - Slate'}>
            <div id={css.container}>
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
                                          Router.push('/article?article=' + article.id, `/subject/${props.subject.name}/${props.course.name}/${article.title}`, {shallow: true});
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
                            <p>Published {moment(props.article?.publish_date).calendar(null, {sameElse: '[on] MMMM Do, YYYY'})}</p>
                            <p>Last updated {moment(props.article?.update_date).calendar(null, {sameElse: '[on] MMMM Do, YYYY'})}</p>
                        </div>
                    </div>
                    <div id={css.body}>
                        {props.article?.content}
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
    await store.dispatch(getArticle(query.article));
    await store.dispatch(getChildren('unit', query.unit));
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
