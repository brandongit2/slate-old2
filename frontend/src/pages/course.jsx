import axios from 'axios';
import Link from 'next/link';
import Router, {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';

import {changeSubject, changeCourse, changeUnit, changeArticle, getSubject, getCourse, getChildren} from '../actions';
import {Layout, Breadcrumbs, Crumb, Dropdown, Item} from '../components';
import {contrasts} from '../util';
import css from './course.scss';

function ArticleList(props) {
    const [articles, setArticles] = React.useState([]);
    
    props.articles.then(articles => setArticles(articles.data));
    
    return (
        <div className={css['article-list']}>
            <div id={css['unit-header']}>
                <span className={css['unit-number']}>Unit {props.unit?.order}</span>
                <span>{props.unit?.display_name}</span>
            </div>
            <div id={css.list}>
                {articles.map(article => (
                    <Link key={article.id}
                          href={'/article?subject=' + props.subject?.id + '&course=' + props.course?.id + '&unit=' + props.unit?.id + '&article=' + article.id}
                          as={'/subject/' + props.subject?.name + '/' + props.course?.name + '/' + article.title}>
                        <a>{article.display_title}</a>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function Course(props) {
    // Boolean; whether white contrasts well with the subject color.
    const brightText = contrasts('ffffff', props.subject?.color);
    return (
        <Layout currentPage=""
                title={props.course?.display_name + ' - Slate'}>
            <style jsx>{`
                --color: #${props.subject ? props.subject.color : 'fff'};
                --subject-text-color: ${brightText ? '#ffffff' : '#000000'};
                --secondary-subject-text-color: ${brightText ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 1)'};
                --tertiary-subject-text-color: ${brightText ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
                --title-color: ${brightText ? '#' + (props.subject ? props.subject.color : 'fff') : 'black'}
            `}</style>
            
            <div id={css.container}>
                <div id={css.info}>
                    <Breadcrumbs>
                        <Crumb><Link href="/subjects"><a>Subjects</a></Link></Crumb>
                        <Crumb><Link href={'/subject/' + props.subject?.name}><a>{props.subject?.display_name}</a></Link></Crumb>
                        <Crumb>
                            <Dropdown mini label={props.course?.display_name}>
                                {props.courses.map(course => (
                                    <Item key={course.id}
                                          onClick={() => {
                                              props.dispatch(changeCourse(course.id));
                                              props.dispatch(getChildren('course', course.id));
                                              Router.push('/course?course=' + course.id, `/subject/${props.subject.name}/${course.name}`, {shallow: true});
                                          }}>
                                        {course.display_name}
                                    </Item>
                                ))}
                            </Dropdown>
                        </Crumb>
                    </Breadcrumbs>
                    <div>
                        <p id={css['label-course']}>COURSE</p>
                        <p id={css.title}>{props.course?.display_name}</p>
                        <p id={css.description}>{props.course?.description}</p>
                    </div>
                </div>
                <div id={css['unit-list']}>
                    <p id={css['units-title']}>Units</p>
                    {props.units.map(unit => (
                        <ArticleList key={unit.id}
                                     subject={props.subject}
                                     course={props.course}
                                     unit={unit}
                                     articles={axios.get('/api/children?unit=' + unit.id)} />
                    ))}
                </div>
            </div>
        </Layout>
    );
}

Course.getInitialProps = async ({store, query}) => {
    await store.dispatch(changeSubject(query.subject));
    await store.dispatch(changeCourse(query.course));
    await store.dispatch(changeUnit(null));
    await store.dispatch(changeArticle(null));
    await store.dispatch(getSubject(query.subject));
    await store.dispatch(getCourse(query.course));
    await store.dispatch(getChildren('course', query.course));
    await store.dispatch(getChildren('subject', query.subject));
};

function mapStateToProps(state) {
    return {
        subject:  state.subjects.find(subject => subject.id === parseInt(state.currentSubject)),
        course:   state.courses.find(course => course.id === parseInt(state.currentCourse)),
        courses:  state.courses,
        units:    state.units,
        articles: state.articles
    };
}

export default withRouter(connect(mapStateToProps)(Course));
