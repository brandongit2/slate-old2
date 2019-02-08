import Link from 'next/link';

import css from './ArticleList.scss';

const ArticleList = props => (
    <div id={css['article-list']}>
        <div id={css['unit-header']}>
            <span className={css['unit-number']}>Unit {props.unit.order}</span>
            <span>{props.unit.name}</span>
        </div>
        <div id={css.list}>
            {props.articles.map(article => (
                <Link key={article.id}
                      href={`/article?subject=${props.subject.id}&course=${props.course.id}&article=${article.id}`}
                      as={`/subject/${props.subject.name}/${props.course.name}/${article.id}`}>
                    <a key={article.id}>{article.title}</a>
                </Link>
            ))}
        </div>
    </div>
);

export default ArticleList;
