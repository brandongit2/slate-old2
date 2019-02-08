import css from './ArticleList.scss';

const ArticleList = props => (
    <div id={css['article-list']}>
        <div id={css['unit-header']}>
            <span className={css['unit-number']}>Unit {props.unit.order}</span>
            <span>{props.unit.name}</span>
        </div>
        <div id={css.list}>
            {props.articles.map(article => (
                <p key={article.id}>{article.title}</p>
            ))}
        </div>
    </div>
);

export default ArticleList;
