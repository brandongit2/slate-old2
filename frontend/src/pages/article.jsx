import {connect} from 'react-redux';

import {changeSubject, changeCourse, changeUnit, changeArticle, getSubject, getCourse, getUnit, getArticle} from '../actions';
import {Layout, Dropdown} from '../components';
import css from './article.scss';

function Article(props) {
    return (
        <Layout>
            <div id={css.container}>
                <div id={css.breadcrumbs}>
                    <Dropdown label="" mini></Dropdown>
                </div>
                <div id={css.article}></div>
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
};

function mapStateToProps(state) {
    return {
        units:    state.units,
        articles: state.articles
    };
}

export default connect(mapStateToProps)(Article);
