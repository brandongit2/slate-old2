import axios from 'axios';
import React from 'react';

import EditableTable from './EditableTable';
import {Loading} from '../../';

export default class Subjects extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            subjects: null
        };
        
        axios.get('/api/all-subjects').then(subjects => {
            this.setState({subjects: subjects.data});
        });
    }
    
    render() {
        const {state} = this;
        return (
            <div>
                {state.subjects === null
                    ? <Loading />
                    : (
                        <EditableTable headers={['Name', 'Description', 'Color']}
                                       data={state.subjects.map(subject => (
                                           {
                                               name:        subject.display_name,
                                               description: subject.description,
                                               color:       subject.color
                                           }
                                       ))} />
                    )
                }
            </div>
        );
    }
}
