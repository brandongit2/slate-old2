import React from 'react';
import {connect} from 'react-redux';

import EditableTable from './EditableTable';

function Subjects(props) {
    return (
        <div>
            <EditableTable headers={['Name', 'Description', 'Color']}
                           data={props.subjects.map(subject => (
                               {
                                   name:        subject.display_name,
                                   description: subject.description,
                                   color:       subject.color
                               }
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
