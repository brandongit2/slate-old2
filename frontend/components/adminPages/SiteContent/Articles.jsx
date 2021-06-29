import axios from 'axios';
import React from 'react';

import ArticleEditor from './ArticleEditor';
import EditableTable from './EditableTable';
import {Breadcrumbs, Dropdown, Loading} from '../../';
import {Crumb} from '../../Breadcrumbs';
import {Item} from '../../Dropdown';

import css from './Articles.scss';

export default class Articles extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            subjects: null,
            courses:  null,
            units:    null,
            articles: null,
            
            currentSubject: 0,
            currentCourse:  0,
            
            articleBeingEdited: 1
        };
        
        const getSubjects = axios.get('http://localhost:3001/api/all-subjects', {withCredentials: true});
        const getCourses = axios.get('http://localhost:3001/api/all-courses', {withCredentials: true});
        const getUnits = axios.get('http://localhost:3001/api/all-units', {withCredentials: true});
        const getArticles = axios.get('http://localhost:3001/api/all-articles', {withCredentials: true});
        
        Promise.all([getSubjects, getCourses, getUnits, getArticles]).then(([subjects, courses, units, articles]) => {
            this.setState({
                subjects: subjects.data,
                courses:  courses.data,
                units:    units.data,
                articles: articles.data,
                
                currentSubject: 0,
                currentCourse:  0
            });
        }).catch(console.error);
    }
    
    getTableData = () => {
        let data = [];
        if (this.state.subjects !== null) {
            let articlesByUnitId = {};
            let units = this.state.units.filter(unit => unit.course_id === this.state.currentCourse);
            units.forEach(unit => {
                articlesByUnitId[unit.id] = [];
            });
            
            let articles = this.state.articles.filter(article => (
                units
                    .map(unit => unit.id)
                    .includes(article.unit_id)
            ));
            articles.forEach(article => {
                articlesByUnitId[article.unit_id].push({
                    id:    article.id,
                    title: article.display_title
                });
            });
            
            Object.entries(articlesByUnitId).forEach(([i, articles]) => {
                data.push(this.state.units.find(unit => unit.id === parseInt(i)).display_name);
                data.push(...articles);
            });
        }
        return data;
    }
    
    render() {
        const {state} = this;
        
        return (
            <div className={css.articles}>
                <div className={css['article-list']}>
                    {state.subjects === null || state.courses === null || state.units === null || state.articles === null
                        ? <Loading />
                        : (
                            <React.Fragment>
                                <div className={css.breadcrumbs}>
                                    <Breadcrumbs>
                                        <Crumb>Subjects</Crumb>
                                        <Crumb>
                                            <Dropdown mini label={state.currentSubject === 0
                                                ? 'Select a subject...'
                                                : state.subjects.find(subject => subject.id === state.currentSubject).display_name
                                            }>
                                                {state.subjects.map(subject => (
                                                    <Item key={subject.id}
                                                          onClick={() => {
                                                              this.setState({
                                                                  currentSubject: subject.id,
                                                                  currentCourse:  0
                                                              });
                                                          }}>
                                                        {subject.display_name}
                                                    </Item>
                                                ))}
                                            </Dropdown>
                                        </Crumb>
                                        {state.currentSubject === 0
                                            ? null
                                            : (
                                                <Dropdown mini label={state.currentCourse === 0 ? 'Select a course...' : state.courses.find(course => course.id === state.currentCourse).display_name}>
                                                    {state.courses
                                                        .filter(course => course.subject_id === state.currentSubject)
                                                        .map(course => (
                                                            <Item key={course.id}
                                                                  onClick={() => {
                                                                      this.setState({currentCourse: course.id});
                                                                  }}>
                                                                {course.display_name}
                                                            </Item>
                                                        ))
                                                    }
                                                </Dropdown>
                                            )
                                        }
                                    </Breadcrumbs>
                                </div>
                                {state.currentSubject === 0
                                    ? <p className={css.hint}>Select a subject to begin.</p>
                                    : (state.currentCourse === 0
                                        ? <p className={css.hint}>Select a course to begin.</p>
                                        : (
                                            <div className={css.table}>
                                                <EditableTable headers={['Title']}
                                                               data={this.getTableData()}
                                                               editIcon
                                                               editCallback={i => {
                                                                   this.setState({articleBeingEdited: i});
                                                               }} />
                                            </div>
                                        )
                                    )
                                }
                            </React.Fragment>
                        )
                    }
                </div>
                <div className={[
                         css['article-editor'],
                         state.articleBeingEdited === 0 ? '' : css.visible
                     ].join(' ')}>
                    <div className={css.back}
                         onClick={() => {
                             this.setState({articleBeingEdited: 0});
                         }}>
                        <i className="material-icons">arrow_back_ios</i>
                        <span>Back</span>
                    </div>
                    <ArticleEditor article={state.articleBeingEdited} />
                </div>
            </div>
        );
    }
}
