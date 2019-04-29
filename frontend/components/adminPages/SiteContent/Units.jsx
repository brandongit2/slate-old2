import axios from 'axios';
import React from 'react';

import EditableTable from './EditableTable';
import {Breadcrumbs, Dropdown, Loading} from '../../';
import {Crumb} from '../../Breadcrumbs';
import {Item} from '../../Dropdown';

import css from './Units.scss';

export default class Units extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            subjects: null,
            courses:  null,
            units:    null,
            articles: null,
            
            currentSubject: 1
        };
        
        const getSubjects = axios.get('/api/all-subjects');
        const getCourses = axios.get('/api/all-courses');
        const getUnits = axios.get('/api/all-units');
        const getArticles = axios.get('/api/all-articles');
        
        Promise.all([getSubjects, getCourses, getUnits, getArticles]).then(([subjects, courses, units, articles]) => {
            this.setState({
                subjects: subjects.data,
                courses:  courses.data,
                units:    units.data,
                articles: articles.data
            });
        }).catch(console.error);
    }
    
    getTableData = () => {
        let data = [];
        if (this.state.subjects !== null && this.state.courses !== null) {
            let courses = this.state.courses.filter(course => course.subject_id === this.state.currentSubject);
            
            let unitsByCourseId = {};
            courses.forEach(course => {
                unitsByCourseId[course.id] = [];
            });
            
            this.state.units.forEach(unit => {
                if (Object.keys(unitsByCourseId).includes(unit.course_id.toString())) {
                    unitsByCourseId[unit.course_id].push({
                        name:        unit.display_name,
                        description: unit.description
                    });
                }
            });
            
            Object.entries(unitsByCourseId).forEach(([i, units]) => {
                data.push(courses.find(course => course.id === parseInt(i)).display_name);
                data.push(...units);
            });
        }
        return data;
    };
    
    render() {
        const {state} = this;
        return (
            <div className={css.units}>
                {state.subjects === null || state.courses === null
                    ? <Loading />
                    : (
                        <React.Fragment>
                            <div className={css.breadcrumbs}>
                                <Breadcrumbs>
                                    <Crumb>Subjects</Crumb>
                                    <Crumb>
                                        <Dropdown mini label={state.subjects.find(subject => subject.id === state.currentSubject).display_name}>
                                            {state.subjects.map(subject => (
                                                <Item key={subject.id}
                                                      onClick={() => {
                                                          this.setState({
                                                              currentSubject: subject.id
                                                          });
                                                      }}>
                                                    {subject.display_name}
                                                </Item>
                                            ))}
                                        </Dropdown>
                                    </Crumb>
                                </Breadcrumbs>
                            </div>
                            <div className={css.table}>
                                <EditableTable headers={['Name', 'Description']}
                                               data={this.getTableData()} />
                            </div>
                        </React.Fragment>
                    )
                }
            </div>
        );
    }
}
