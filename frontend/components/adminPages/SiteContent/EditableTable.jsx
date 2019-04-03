import React from 'react';
import ReactDOM from 'react-dom';

import css from './EditableTable.scss';

/*
 * This class creates a table with rows which are rearrangeable and items which are editable.
 *
 * HOW ROW REARRANGING WORKS:
 * Each row is assigned an ID. When the user mouses down on the "move" widget, that row is made
 * transparent and an identical floating row is created via React portals. This floating row moves around
 * with the cursor.
 *
 * The screen is split into "fields." A field is a vertical space which corresponds to a row of the
 * table. If the user releases the mouse in a field, the row snaps into that row.
 *
 * +---+---------------+
 * | = | Table row 1   | Field 1 (includes top of screen)     In this example, if the mouse were
 * +---+---------------+ ------------------------------------ released in field 1, the floating table
 * | = | Table row 2   | Field 2                              row would snap to table row 1's position.
 * +---+---------------+ ------------------------------------ If it were released in field 2, it would
 * | = | Table row 3   | Field 3 (includes bottom of screen)  snap to table row 2's position, and so on.
 * +---+---------------+
 */

export default class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            rows:        [],
            rowOrder:    [],
            isRowMoving: false,
            
            floatingRow:    -1,
            floatingRowPos: [0, 0],
            currentField:   -1
        };
        
        this.fieldBounds = [];
        this.tableRows = [];
        this.mouseOffset = [0, 0]; // How far the cursor was from the top left corner of the row on mouse down.
    }
    
    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                rows:     this.props.data,
                rowOrder: this.props.data.map((row, i) => i)
            });
        }
    }
    
    beginMoveRow = (e, i) => {
        const rowPos = this.tableRows[i].getBoundingClientRect();
        
        this.setState({
            isRowMoving:    true,
            floatingRow:    i,
            floatingRowPos: [rowPos.left, rowPos.top],
            currentField:   i
        });
        
        this.mouseOffset = [e.clientX - rowPos.left, e.clientY - rowPos.top];
        
        window.addEventListener('mousemove', this.moveRow);
        window.addEventListener('mouseup', this.endMoveRow);
    };
    
    moveRow = e => {
        let currentField = -1;
        
        // Gets current field.
        for (const [i, fieldBound] of this.fieldBounds.entries()) {
            if (e.clientY <= fieldBound) {
                currentField = i;
                break;
            }
        }
        if (currentField === -1) currentField = this.fieldBounds.length;
        
        let rowOrder = this.state.rowOrder;
        
        // If mouse moved across a field boundary
        if (this.state.currentField !== currentField && this.state.currentField !== -1) {
            let swaps = [];
            if (this.state.currentField < currentField) { // Mouse moved down
                for (let i = this.state.currentField; i < currentField; i++) {
                    swaps.push([i, i + 1]);
                }
            } else { // Mouse moved up
                for (let i = this.state.currentField; i > currentField; i--) {
                    swaps.push([i, i - 1]);
                }
            }
            
            for (const swap of swaps) {
                // Swap the two rows
                let temp = rowOrder[swap[1]];
                rowOrder[swap[1]] = rowOrder[swap[0]];
                rowOrder[swap[0]] = temp;
            }
            
            console.log(this.state.currentField, currentField);
            if (this.state.currentField < currentField) { // Mouse moved down
                for (let i = this.state.currentField; i < currentField; i++) {
                    console.log('moving up ' + i);
                    this.tableRows[this.state.rowOrder[i]].style.animation = `${css['move-up']} 0.3s`;
                }
            } else { // Mouse moved up
                for (let i = this.state.currentField; i > currentField; i--) {
                    console.log('moving down ' + i);
                    this.tableRows[this.state.rowOrder[i]].style.animation = `${css['move-down']} 0.3s`;
                }
            }
        }
        
        this.setState({
            floatingRowPos: [
                e.clientX - this.mouseOffset[0],
                e.clientY - this.mouseOffset[1]
            ],
            currentField, rowOrder
        });
    };
    
    endMoveRow = () => {
        this.setState({
            isRowMoving: false,
            floatingRow: -1
        });
        
        window.removeEventListener('mousemove', this.moveRow);
        window.removeEventListener('mouseup', this.endMoveRow);
    };
    
    render() {
        const {props} = this;
        
        if (this.fieldBounds.length === 0) {
            for (const row of this.tableRows.slice(1)) {
                this.fieldBounds.push(row.getBoundingClientRect().top);
            }
        }
        
        return (
            <React.Fragment>
                {this.state.isRowMoving
                    ? (
                        ReactDOM.createPortal(
                            <table className={[css.table, css.floating].join(' ')}
                                   style={{
                                       width:     `${this.tableWidth}px`,
                                       transform: `translate(${this.state.floatingRowPos[0]}px, ${this.state.floatingRowPos[1]}px)`,
                                       animation: `${css['fade-hover-in']} 0.2s forwards`
                                   }}>
                                <tbody>
                                    <tr>
                                        <td><i className="material-icons">reorder</i></td>
                                        {this.state.rows[this.state.floatingRow].map((datum, i) => (
                                            <td key={i}>{datum}</td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>,
                            document.body
                        )
                    ) : null
                }
                <table className={css.table} ref={el => { if (el) this.tableWidth = el.offsetWidth; }}>
                    <thead>
                        <tr>
                            <th />
                            {props.headers.map((header, i) => (
                                <th key={i}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.rowOrder.map((i, pos) => {
                            const row = this.state.rows[i];
                            return (
                                <tr key={i}
                                    ref={el => { if (el) this.tableRows.push(el); }}
                                    style={{opacity: i === this.state.floatingRow ? '0' : '1'}}>
                                    <td onMouseDown={e => this.beginMoveRow(e, pos)}>
                                        <i className="material-icons">reorder</i>
                                    </td>
                                    {row.map((datum, i) => (
                                        <td key={i}>
                                            {datum}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </React.Fragment>
        );
    }
}
