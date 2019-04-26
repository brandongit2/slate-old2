import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import {withRouter} from 'next/router';
import React from 'react';

import {Layout, Breadcrumbs, Dropdown} from '../components';
import {Crumb} from '../components/Breadcrumbs';
import {Item} from '../components/Dropdown';

import css from './article.scss';

function Article(props) {
    const [articleContent, setArticleContent] = React.useState(props.articleContent);
    const [currentArticle, changeArticle] = React.useReducer((oldArticle, newArticleId) => {
        axios.get(`/api/article-content/${newArticleId}`)
            .then(articleContent => setArticleContent(articleContent.data));
        return props.articles.find(article => article.id === newArticleId);
    }, props.articles.find(article => article.id === parseInt(props.router.query.article)));
    
    return (
        <Layout title={`${currentArticle.display_title} - Slate`}>
            <div className={css.article}>
                <Breadcrumbs>
                    <Crumb>
                        <Link href="/subjects"><a>Subjects</a></Link>
                    </Crumb>
                    <Crumb><Link href={`/subject/${props.subject.name}`}>
                        <a>{props.subject.display_name}</a>
                    </Link></Crumb>
                    <Crumb>
                        <Link href={`/subject/${props.subject.name}/${props.course.name}`}>
                            <a>{props.course.display_name}</a>
                        </Link>
                    </Crumb>
                    <Crumb>
                        <Dropdown label={currentArticle.display_title} mini>
                            {props.articles.map(article => (
                                <Item key={article.id}
                                      onClick={() => {
                                          changeArticle(article.id);
                                          
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
                        <h1>{currentArticle.display_title}</h1>
                        <div id={css.date}>
                            <p>
                                Published&nbsp;
                                <time dateTime={currentArticle.publish_date}>
                                    {moment(currentArticle.publish_date)
                                        .calendar(null, {sameElse: '[on] MMMM Do, YYYY'})}
                                </time>
                            </p>
                            <p>
                                Last updated&nbsp;
                                <time dateTime={currentArticle.update_date}>
                                    {moment(currentArticle.update_date)
                                        .calendar(null, {sameElse: '[on] MMMM Do, YYYY'})}
                                </time>
                            </p>
                        </div>
                    </div>
                    {/* eslint-disable-next-line react/no-danger */}
                    <article dangerouslySetInnerHTML={{__html: articleContent}} />
                </main>
            </div>
        </Layout>
    );
}

Article.getInitialProps = async ctx => ({
    subject:        (await axios.get(`/api/subject/${ctx.query.subject}`)).data[0],
    course:         (await axios.get(`/api/course/${ctx.query.course}`)).data[0],
    unit:           (await axios.get(`/api/unit/${ctx.query.unit}`)).data[0],
    articles:       (await axios.get(`/api/children?unit=${ctx.query.unit}`)).data,
    articleContent: (await axios.get(`/api/article-content/${ctx.query.article}`)).data
});

export default withRouter(Article);
