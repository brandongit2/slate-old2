import {connect} from 'react-redux';

import {changeArticle, getSubject, getCourse, getUnitsByCourse, getArticlesByCourse} from '../actions';
import {Layout} from '../components';
import css from './article.scss';

function Article(props) {
    return (
        <Layout>
            <div id={css.container}>
                <div id={css.breadcrumbs}>
                    
                </div>
                <div id={css.article}></div>
            </div>
        </Layout>
    );
}

Article.getInitialProps = async ({store, query}) => {
    console.log(query);
    await store.dispatch(changeArticle(query.article));
    await store.dispatch(getSubject(query.subject));
    await store.dispatch(getCourse(query.course));
    await store.dispatch(getUnitsByCourse(query.course));
    await store.dispatch(getArticlesByCourse(query.course));
};

function mapStateToProps(state) {
    return {
        units:    state.units,
        articles: state.articles
    };
}

export default connect(mapStateToProps)(Article);
