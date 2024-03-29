import axios from 'axios';
import React from 'react';

import EditableTable from './EditableTable';
import {Loading} from '../../';

import css from './Courses.scss';

export default class Courses extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            subjects: null,
            courses:  null
        };
        
        const getSubjects = axios.get('http://localhost:3001/api/all-subjects', {withCredentials: true});
        const getCourses = axios.get('http://localhost:3001/api/all-courses', {withCredentials: true});
        
        Promise.all([getSubjects, getCourses]).then(([subjects, courses]) => {
            this.setState({subjects: subjects.data});
            this.setState({courses: courses.data});
        }).catch(console.error);
    }
    
    render() {
        const {state} = this;
        return (
            <div className={css.courses}>
                {state.subjects === null || state.courses === null
                    ? <Loading />
                    : (
                        <EditableTable headers={['Name', 'Description']}
                                       data={(() => {
                                           let coursesBySubjectId = [];
                                           for (let i = 0; i < state.subjects.length; i++) {
                                               coursesBySubjectId.push([]);
                                           }
                                           
                                           state.courses.forEach(course => {
                                               coursesBySubjectId[course.subject_id - 1].push({
                                                   name:        course.display_name,
                                                   description: course.description
                                               });
                                           });
                                           
                                           let data = [];
                                           coursesBySubjectId.forEach((courses, i) => {
                                               data.push(state.subjects.find(subject => parseInt(subject.id) === i + 1).display_name);
                                               data.push(...courses);
                                           });
                                           
                                           return data;
                                       })()} />
                    )
                }
            </div>
        );
    }
}
