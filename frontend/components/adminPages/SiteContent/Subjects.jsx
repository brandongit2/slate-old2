import React from 'react';
import {connect} from 'react-redux';

import EditableTable from './EditableTable';

function Subjects(props) {
    console.log(props.subjects, props.courses);
    return (
        <div>
            <EditableTable headers={['Name', 'Description', 'Color']}
                           data={props.subjects.map(subject => (
                               [subject.display_name, subject.description, subject.color]
                           ))} />
        </div>
    );
}

function mapStateToProps(state) {
    return {
        subjects: state.subjects
    };
}

export default connect(mapStateToProps)(Subjects);
