import axios from 'axios';
import Link from 'next/link';
import {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';

import {changeSubject, changeCourse, changeUnit, changeArticle, getSubject, getCourse, getChildren} from '../actions';
import {Layout, Breadcrumbs, Crumb, Dropdown, Item} from '../components';
import {apiPrefix1, apiPrefix2} from '../constants';
import {contrasts} from '../util';
import css from './course.scss';

const apiPrefix = process.env ? apiPrefix2 : apiPrefix1;

function ArticleList(props) {
    const [articles, setArticles] = React.useState([]);
    
    props.articles.then(articles => setArticles(articles.data));
    
    return (
        <div className={css['article-list']}>
            <div id={css['unit-header']}>
                <span className={css['unit-number']}>Unit {props.unit.order}</span>
                <span>{props.unit.display_name}</span>
            </div>
            <div id={css.list}>
                {articles.map(article => (
                    <Link key={article.id}
                          href={`/article?subject=${props.subject.id}&course=${props.course.id}&unit=${props.unit.id}&article=${article.id}`}
                          as={`/subject/${props.subject.name}/${props.course.name}/${article.id}`}>
                        <a>{article.display_title}</a>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function Course(props) {
    // Boolean; whether white contrasts well with the subject color.
    const brightText = contrasts('ffffff', props.subject.color);
    return (
        <Layout currentPage=""
                title={props.course.display_name + ' - Slate'}>
            <style jsx>{`
                --color: #${props.subject.color};
                --subject-text-color: ${brightText ? '#ffffff' : '#000000'};
                --secondary-subject-text-color: ${brightText ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 1)'};
                --tertiary-subject-text-color: ${brightText ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
                --title-color: ${brightText ? '#' + props.subjectColor : 'black'}
            `}</style>
            
            <div id={css.container}>
                <div id={css.info}>
                    <Breadcrumbs>
                        <Crumb><Link href="/subjects"><a>Subjects</a></Link></Crumb>
                        <Crumb><Link href={'/subject/' + props.subject.name}><a>{props.subject.display_name}</a></Link></Crumb>
                        <Crumb>
                            <Dropdown mini label={props.course.display_name}>
                                <Item>hahaha</Item>
                            </Dropdown>
                        </Crumb>
                    </Breadcrumbs>
                    <div>
                        <p id={css['label-course']}>COURSE</p>
                        <p id={css.title}>{props.course.display_name}</p>
                        <p id={css.description}>{props.course.description}</p>
                    </div>
                </div>
                <div id={css['unit-list']}>
                    <p id={css['units-title']}>Units</p>
                    {props.units.map(unit => (
                        <ArticleList key={unit.id}
                                     subjectId={props.subjectId}
                                     subject={props.subject}
                                     courseId={props.courseId}
                                     course={props.course}
                                     unitId={unit.id}
                                     unit={unit}
                                     articles={axios.get(apiPrefix + '/children?unit=' + unit.id)} />
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
};

function mapStateToProps(state) {
    return {
        subject:  state.subjects[0],
        course:   state.courses[0],
        units:    state.units,
        articles: state.articles
    };
}

export default withRouter(connect(mapStateToProps)(Course));
