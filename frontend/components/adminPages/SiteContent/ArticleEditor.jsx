import axios from 'axios';
import React from 'react';

import {Loading} from '../../';

import css from './ArticleEditor.scss';

export default class ArticleEditor extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            article:        null,
            articleContent: null
        };
        
        this.getData();
    }
    
    componentDidUpdate(prevProps) {
        if (prevProps.article !== this.props.article) {
            this.setState({
                article:        null,
                articleContent: null
            });
            
            this.getData();
        }
    }
    
    getData = () => {
        if (this.props.article !== 0) {
            const getArticle = axios.get(`/api/article/${this.props.article}`);
            const getArticleContent = axios.get(`/api/article-content/${this.props.article}`);
            
            Promise.all([getArticle, getArticleContent]).then(([article, articleContent]) => {
                this.setState({
                    article:        article.data[0],
                    articleContent: articleContent.data
                });
            });
        }
    };
    
    render() {
        return (
            <div className={css['article-editor']}>
                {this.state.article === null
                    ? <Loading />
                    : (
                        <React.Fragment>
                            <p>Now editing</p>
                            <p>{this.state.article.display_title}</p>
                            <textarea value={this.state.articleContent} />
                        </React.Fragment>
                    )
                }
            </div>
        );
    }
}
