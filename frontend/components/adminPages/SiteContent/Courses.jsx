import React from 'react';
import {connect} from 'react-redux';

import EditableTable from './EditableTable';

function Courses(props) {
    return (
        <div>
            <EditableTable headers={['Parent subject', 'Name', 'Description']}
                           data={props.courses.map(course => (
                               {
                                   subjectId:   Object.values(props.subjects).find(subject => subject.id === course.subject_id).display_name,
                                   name:        course.display_name,
                                   description: course.description
                               }
                           ))} />
        </div>
    );
}

function mapStateToProps(state) {
    return {
        subjects: state.subjects,
        courses:  state.courses
    };
}

export default connect(mapStateToProps)(Courses);
