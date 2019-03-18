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
        originalRowPos:  -1,
        currentField:    -1
    };
    
    constructor(props) {
        super(props);
        
        props.dispatch(getAllSubjects());
        
        this.tableWidth = 0;
        this.tableRows = [];
        this.fieldBounds = [];
        this.subjectList = [];
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
        let currentField = -1;
        let originalRowPos = this.state.originalRowPos;
        for (const [i, fieldBound] of this.fieldBounds.entries()) {
            if (e.clientY <= fieldBound) {
                currentField = i;
                break;
            }
        }
        if (currentField === -1) currentField = this.fieldBounds.length;
        
        // If mouse moved across a field boundary
        if (this.state.currentField !== currentField && this.state.currentField !== -1) {
            const swap = [this.state.currentField, currentField];
            
            // Swap the two rows
            let temp = this.subjectList[swap[1]];
            this.subjectList[swap[1]] = this.subjectList[swap[0]];
            this.subjectList[swap[0]] = temp;
            originalRowPos = currentField;
            
            temp = this.tableRows[swap[1]];
            this.tableRows[swap[1]] = this.tableRows[swap[0]];
            this.tableRows[swap[0]] = temp;
            
            if (this.state.currentField < currentField) { // Mouse moved down
                this.tableRows[this.state.currentField].style.animation = `${css['move-up']} 0.3s forwards`;
            } else if (this.state.currentField > currentField) { // Mouse moved up
                this.tableRows[this.state.currentField].style.animation = `${css['move-down']} 0.3s forwards`;
            }
        }
        
        this.setState({
            rowBeingMoved: {
                ...this.state.rowBeingMoved,
                x: e.clientX - this.state.mouseOffset[0],
                y: e.clientY - this.state.mouseOffset[1]
            },
            currentField, originalRowPos
        });
    };
    
    endMoveRow = () => {
        this.setState({
            isRowBeingMoved: false,
            rowBeingMoved:   {},
            originalRowPos:  -1,
            currentField:    -1
        });
        window.removeEventListener('mouseup', this.endMoveRow);
        window.removeEventListener('mousemove', this.moveRow);
    };
    
    render() {
        const {props} = this;
        
        if (this.fieldBounds.length === 0) {
            for (const row of this.tableRows.slice(1)) {
                this.fieldBounds.push(row.getBoundingClientRect().top);
            }
        }
        
        if (this.subjectList.length === 0) {
            this.subjectList = [...props.subjects];
        }
        
        return (
            <div>
                {this.state.isRowBeingMoved ? (
                    <FloatingRow>
                        <table className={[css.table, css.floating].join(' ')}
                               style={{
                                   width:     `${this.tableWidth}px`,
                                   transform: `translate(${this.state.rowBeingMoved.x}px, ${this.state.rowBeingMoved.y}px)`,
                                   animation: `${css['fade-hover-in']} 0.2s forwards`
                               }}>
                            <tbody>
                                <tr>
                                    <td>
                                        <i className="material-icons">
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
                        {this.subjectList.map((subject, i) => (
                            <React.Fragment key={subject.id}>
                                <tr ref={ref => {
                                        if (ref && this.tableRows.length !== props.subjects.length) {
                                            this.tableRows[i] = ref;
                                        }
                                    }}
                                    style={{opacity: this.state.originalRowPos === i ? '0' : '1'}}>
                                    <td>
                                        <i className="material-icons"
                                           onMouseDown={e => this.beginMoveRow(subject.id, e, i)}>
                                            reorder
                                        </i>
                                    </td>
                                    <td>{subject.display_name}</td>
                                    <td>{subject.description}</td>
                                </tr>
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
