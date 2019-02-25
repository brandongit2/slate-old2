import axios from 'axios';
import React from 'react';
import {connect} from 'react-redux';

import {changeSubject, changeCourse, changeUnit, changeArticle, getSubject, getCourse, getUnit, getArticle} from '../actions';
import {Layout, Dropdown, Item} from '../components';
import {apiPrefix1, apiPrefix2} from '../constants';
import css from './article.scss';

const apiPrefix = process.env ? apiPrefix2 : apiPrefix1;

function Article(props) {
    const [articles, setArticles] = React.useState(props.articles);
    
    return (
        <Layout>
            <div id={css.container}>
                <div id={css.breadcrumbs}>
                    <Dropdown label={props.currentArticle.display_title} mini>{
                        articles.map(article => <Item key={article.id}>{article.display_title}</Item>)
                    }</Dropdown>
                </div>
                <div id={css.article}>{props.currentArticle.content}</div>
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
    
    return {
        articles: (await axios.get(`${apiPrefix}/children?unit=${query.article}`)).data,
        
        currentSubject: (await axios.get(`${apiPrefix}/subject/${query.subject}`)).data[0],
        currentCourse:  (await axios.get(`${apiPrefix}/course/${query.course}`)).data[0],
        currentUnit:    (await axios.get(`${apiPrefix}/unit/${query.unit}`)).data[0],
        currentArticle: (await axios.get(`${apiPrefix}/article/${query.article}`)).data[0]
    };
};

function mapStateToProps(state) {
    return {
        subject: state.subjects.find(el => el.id === state.currentSubject),
        course:  state.courses.find(el => el.id === state.currentCourse),
        unit:    state.units.find(el => el.id === state.currentUnit),
        article: state.articles.find(el => el.id === state.currentArticle)
    };
}

export default connect(mapStateToProps)(Article);
