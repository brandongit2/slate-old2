import React from 'react';
import {connect} from 'react-redux';

import EditableTable from './EditableTable';

function Courses(props) {
    console.log(props.courses);
    return (
        <div>
            <EditableTable headers={['Name', 'Description', 'Color']}
                           data={props.courses.map(course => (
                               [course.display_name, course.description, course.color]
                           ))} />
        </div>
    );
}

function mapStateToProps(state) {
    return {
        courses: state.courses
    };
}

export default connect(mapStateToProps)(Courses);
