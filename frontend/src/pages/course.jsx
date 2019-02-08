import Link from 'next/link';
import {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';

import {
    changeCourse, getSubject, getCourse, getUnitsByCourse, getArticlesByCourse
} from '../actions';
import {ArticleList, Layout} from '../components';
import {kebabToProper} from '../util';
import css from './course.scss';

class Course extends React.Component {
    static async getInitialProps({store, query}) {
        await store.dispatch(changeCourse(query.course));
        await store.dispatch(getSubject(query.subject));
        await store.dispatch(getCourse(query.course));
        await store.dispatch(getUnitsByCourse(query.course));
        await store.dispatch(getArticlesByCourse(query.course));
    }

    render() {
        const {props} = this;
        return (
            <Layout currentPage=""
                    title={kebabToProper(props.course.name) + ' - Slate'}>
                <style jsx>{`
                    --color: #${props.subject.color};
                `}</style> {/* eslint-disable-line react/jsx-closing-tag-location */}

                <div id={css.container}>
                    <div id={css.info}>
                        <div id={css.breadcrumbs}>
                            <Link href="/subjects"><a>Subjects</a></Link>
                            <span className={css.arrow}>&gt;</span>
                            <Link href={`/subject/${props.subject.name}`}><a>{kebabToProper(props.subject.name)}</a></Link>
                            <span className={css.arrow}>&gt;</span>
                            <span>{kebabToProper(props.course.name)}</span>
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
                                         unitId={id}
                                         unit={unit}
                                         articles={unit.articles.map(articleId => {
                                             return {
                                                 id: articleId,
                                                 ...props.articles[articleId]
                                             };
                                         })} />
                        ))}
                    </div>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps = state => ({
    subject:  Object.values(state.subjects)[0],
    course:   Object.values(state.courses)[0],
    units:    state.units,
    articles: state.articles
});

export default withRouter(connect(mapStateToProps)(Course));
