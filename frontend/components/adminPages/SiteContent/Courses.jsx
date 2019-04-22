import React from 'react';
import {connect} from 'react-redux';

import EditableTable from './EditableTable';

function Courses(props) {
    const [data, setData] = React.useState({});
    
    React.useEffect(() => {
        if (props.courses && props.subjects) {
            props.courses.map(course => {
                const subjectName = props.subjects.find(subject => subject.id === course.subject_id).display_name;
                setData({
                    [subjectName]: [
                        ...(data[subjectName] ? data[subjectName] : []),
                        {
                            name:        course.name,
                            description: course.description
                        }
                    ]
                });
            });
        }
    });
    
    return (
        <div>
            <EditableTable headers={['Parent subject', 'Name', 'Description']}
                           data={data} />
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
