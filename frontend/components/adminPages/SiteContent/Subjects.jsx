import React from 'react';
import {connect} from 'react-redux';

import {getAllSubjects} from '../../../actions';

class Subjects_Unwrapped extends React.Component {
    constructor(props) {
        super(props);
        
        props.dispatch(getAllSubjects());
    }
    
    render() {
        const {props} = this;
        return (
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Subject</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {props.subjects.map(subject => (
                        <tr key={subject.id}>
                            <td><i className="material-icons">reorder</i></td>
                            <td>{subject.display_name}</td>
                            <td>{subject.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}

function mapStateToProps(state) {
    return {
        subjects: state.subjects
    };
}

export const Subjects = connect(mapStateToProps)(Subjects_Unwrapped);
