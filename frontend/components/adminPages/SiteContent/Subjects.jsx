import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

import {getAllSubjects} from '../../../actions';

import css from './Subjects.scss';

function FloatingRow(props) {
    return ReactDOM.createPortal(
        props.children,
        document.body
    );
}

class Subjects_Unwrapped extends React.Component {
    state = {
        isRowBeingMoved: false,
        rowBeingMoved:   {},
        mouseOffset:     [0, 0],
        originalRowPos:  -1
    };
    
    constructor(props) {
        super(props);
        
        props.dispatch(getAllSubjects());
        
        this.tableWidth = 0;
        this.rowHeight = 0;
        this.tableRows = {};
    }
    
    beginMoveRow = (subjectId, e, i) => {
        const subject = this.props.subjects.find(subject => subject.id === subjectId);
        const tr = e.target.parentNode.parentNode.getBoundingClientRect();
        this.setState({
            isRowBeingMoved: true,
            rowBeingMoved:   {
                ...subject,
                x: tr.left,
                y: tr.top
            },
            // Cursor distance to top left corner of the table.
            mouseOffset:    [e.clientX - tr.left, e.clientY - tr.top],
            originalRowPos: i
        });
        
        window.addEventListener('mouseup', this.endMoveRow);
        window.addEventListener('mousemove', this.moveRow);
    };
    
    moveRow = e => {
        this.setState({
            rowBeingMoved: {
                ...this.state.rowBeingMoved,
                x: e.clientX - this.state.mouseOffset[0],
                y: e.clientY - this.state.mouseOffset[1]
            }
        });
    };
    
    endMoveRow = () => {
        this.setState({
            isRowBeingMoved: false,
            rowBeingMoved:   {},
            originalRowPos:  -1
        });
        window.removeEventListener('mouseup', this.endMoveRow);
        window.removeEventListener('mousemove', this.moveRow);
    };
    
    render() {
        const {props} = this;
        return (
            <div>
                {this.state.isRowBeingMoved ? (
                    <FloatingRow>
                        <table className={[css.table, css.floating].join(' ')}
                               style={{
                                   width:     `${this.tableWidth}px`,
                                   transform: `translate(${this.state.rowBeingMoved.x}px, ${this.state.rowBeingMoved.y}px)`
                               }}>
                            <tbody>
                                <tr>
                                    <td>
                                        <i className="material-icons"
                                           onMouseDown={() => this.beginMoveRow(this.state.rowBeingMoved.id)}>
                                            reorder
                                        </i>
                                    </td>
                                    <td>{this.state.rowBeingMoved.display_name}</td>
                                    <td>{this.state.rowBeingMoved.description}</td>
                                </tr>
                            </tbody>
                        </table>
                    </FloatingRow>
                ) : null}
                <table className={css.table} ref={ref => { if (ref) this.tableWidth = ref.offsetWidth; }}>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Subject</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.subjects.map((subject, i) => (
                            <React.Fragment key={subject.id}>
                                {this.state.originalRowPos === i ? (
                                    <tr><td colSpan="3" style={{opacity: '0'}}>
                                        This text is used for vertical spacing.
                                    </td></tr>
                                ) : (
                                    <tr ref={ref => {
                                            if (ref) {
                                                if (Object.keys(this.tableRows).length !== props.subjects.length) {
                                                    this.tableRows[subject.id] = ref.getBoundingClientRect().top;
                                                }
                                                if (this.rowHeight === 0) {
                                                    this.rowHeight = ref.offsetHeight;
                                                }
                                            }
                                        }}>
                                        <td>
                                            <i className="material-icons"
                                               onMouseDown={e => this.beginMoveRow(subject.id, e, i)}>
                                                reorder
                                            </i>
                                        </td>
                                        <td>{subject.display_name}</td>
                                        <td>{subject.description}</td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        subjects: state.subjects
    };
}

export const Subjects = connect(mapStateToProps)(Subjects_Unwrapped);
