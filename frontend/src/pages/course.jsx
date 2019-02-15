import Link from 'next/link';
import {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';

import {changeCourse, getSubject, getCourse, getUnitsByCourse, getArticlesByCourse} from '../actions';
import {Layout} from '../components';
import {contrasts, kebabToProper} from '../util';
import css from './course.scss';

function ArticleList(props) {
    return (
        <div className={css['article-list']}>
            <div id={css['unit-header']}>
                <span className={css['unit-number']}>Unit {props.unit.order}</span>
                <span>{props.unit.name}</span>
            </div>
            <div id={css.list}>
                {props.articles.map(article => (
                    <Link key={article.id}
                          href={`/article?subject=${props.subjectId}&course=${props.courseId}&article=${article.id}`}
                          as={`/subject/${props.subject.name}/${props.course.name}/${article.id}`}>
                        <a key={article.id}>{article.title}</a>
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
                title={kebabToProper(props.course.name) + ' - Slate'}>
            <style jsx>{`
                --color: #${props.subject.color};
                --subject-text-color: ${brightText ? '#ffffff' : '#000000'};
                --secondary-subject-text-color: ${brightText ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 1)'};
                --tertiary-subject-text-color: ${brightText ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
                --title-color: ${brightText ? '#' + props.subjectColor : 'black'}
            `}</style>
            
            <div id={css.container}>
                <div id={css.info}>
                    <div id={css.breadcrumbs}>
                        <Link href="/subjects"><a>Subjects</a></Link>
                        <span className={css.arrow}>&gt;</span>
                        <Link href={`/subject/${props.subject.name}`}>
                            <a>{kebabToProper(props.subject.name)}</a>
                        </Link>
                        <span className={css.arrow}>&gt;</span>
                        <span><b>{kebabToProper(props.course.name)}</b></span>
                    </div>
                    <div>
                        <p id={css['label-course']}>COURSE</p>
                        <p id={css.title}>{kebabToProper(props.course.name)}</p>
                        <p id={css.description}>{props.course.description}</p>
                    </div>
                </div>
                <div id={css['unit-list']}>
                    <p id={css['units-title']}>Units</p>
                    {Object.entries(props.units).map(([id, unit]) => (
                        <ArticleList key={id}
                                     subjectId={props.subjectId}
                                     subject={props.subject}
                                     courseId={props.courseId}
                                     course={props.course}
                                     unitId={id}
                                     unit={unit}
                                     articles={unit.articles.map(articleId => ({
                                         id: articleId,
                                         ...props.articles[articleId]
                                     }))} />
                    ))}
                </div>
            </div>
        </Layout>
    );
}

Course.getInitialProps = async ({store, query}) => {
    await store.dispatch(changeCourse(query.course));
    await store.dispatch(getSubject(query.subject));
    await store.dispatch(getCourse(query.course));
    await store.dispatch(getUnitsByCourse(query.course));
    await store.dispatch(getArticlesByCourse(query.course));
};

function mapStateToProps(state) {
    return {
        subjectId: Object.keys(state.subjects)[0],
        subject:   Object.values(state.subjects)[0],
        courseId:  Object.keys(state.courses)[0],
        course:    Object.values(state.courses)[0],
        units:     state.units,
        articles:  state.articles
    };
}

export default withRouter(connect(mapStateToProps)(Course));
