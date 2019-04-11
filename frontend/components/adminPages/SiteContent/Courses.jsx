import React from 'react';
import {connect} from 'react-redux';

import EditableTable from './EditableTable';

function Courses(props) {
    return (
        <div>
            <EditableTable headers={['Subject', 'Name', 'Description']}
                           data={props.courses.map(course => (
                               {
                                   subjectId:   course.subject_id,
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
