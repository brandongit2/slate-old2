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
            
            currentSubject: 0
        };
        
        const getSubjects = axios.get('http://localhost:3001/api/all-subjects', {withCredentials: true});
        const getCourses = axios.get('http://localhost:3001/api/all-courses', {withCredentials: true});
        const getUnits = axios.get('http://localhost:3001/api/all-units', {withCredentials: true});
        
        Promise.all([getSubjects, getCourses, getUnits]).then(([subjects, courses, units]) => {
            this.setState({
                subjects: subjects.data,
                courses:  courses.data,
                units:    units.data
            });
        }).catch(console.error);
    }
    
    getTableData = () => {
        let data = [];
        if (this.state.subjects !== null) {
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
                {state.subjects === null
                    ? <Loading />
                    : (
                        <React.Fragment>
                            <div className={css.breadcrumbs}>
                                <Breadcrumbs>
                                    <Crumb>Subjects</Crumb>
                                    <Crumb>
                                        <Dropdown mini label={state.currentSubjectName ? state.currentSubjectName : 'Select a subject...'}>
                                            {state.subjects.map(subject => (
                                                <Item key={subject.id}
                                                      onClick={() => {
                                                          // This call to setState rerenders the entire
                                                          // component, resetting the Dropdown's label
                                                          // to 'Select a subject...'. The label must be
                                                          // set in this component for it to change.
                                                          this.setState({
                                                              currentSubject:     subject.id,
                                                              currentSubjectName: subject.display_name
                                                          });
                                                      }}>
                                                    {subject.display_name}
                                                </Item>
                                            ))}
                                        </Dropdown>
                                    </Crumb>
                                </Breadcrumbs>
                            </div>
                            {state.currentSubject === 0
                                ? <p className={css.hint}>Select a subject to begin.</p>
                                : (
                                    <div className={css.table}>
                                        <EditableTable headers={['Name', 'Description']}
                                                       data={this.getTableData()} />
                                    </div>
                                )
                            }
                        </React.Fragment>
                    )
                }
            </div>
        );
    }
}
