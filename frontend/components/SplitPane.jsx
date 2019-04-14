/*
 * This component renders two child components next to each other, with a
 * separating bar which can be dragged to grow/shrink the children.
 */

import React from 'react';

import css from './SplitPane.scss';

export default class SplitPane extends React.Component {
    // props.direction can be either 'horizontal' or 'vertical'.
    
    state = {
        firstPaneSize: -1
    };
    
    constructor(props) {
        super(props);
        
        this.container = React.createRef();
        this.handle = React.createRef();
        
        // How far the mouse was from the left/top of the handle on mouse down.
        this.mouseOffset = -1;
    }
    
    componentDidMount() {
        this.setState({
            firstPaneSize: this.props.direction === 'horizontal'
                ? this.container.current.offsetWidth / 2
                : this.container.current.offsetHeight / 2
        });
    }
    
    // If the direction changes, reset the pane widths. Example issue:
    // Say the original direction was horizontal, and firstPaneSize was 1000.
    // Now, the direction changes to vertical, but the screen size is only
    // 900px. The user will not be able to move the handle back until reload.
    shouldComponentUpdate(nextProps) {
        if (this.props.direction !== nextProps.direction) {
            this.setState({
                firstPaneSize: nextProps.direction === 'horizontal'
                    ? this.container.current.offsetWidth / 2
                    : this.container.current.offsetHeight / 2
            });
        }
        
        return true;
    }
    
    resize = e => {
        const {props} = this;
        
        let firstPaneSize = props.direction === 'horizontal'
            ? e.clientX - this.container.current.getBoundingClientRect().left - this.mouseOffset
            : e.clientY - this.container.current.getBoundingClientRect().top - this.mouseOffset;
        
        if (firstPaneSize < props.minPaneSize) {
            firstPaneSize = props.minPaneSize;
        } else if (
            props.direction === 'horizontal'
            && firstPaneSize > this.container.current.offsetWidth - props.minPaneSize
        ) {
            firstPaneSize = this.container.current.offsetWidth - props.minPaneSize;
        } else if (
            props.direction === 'vertical'
            && firstPaneSize > this.container.current.offsetHeight - props.minPaneSize
        ) {
            firstPaneSize = this.container.current.offsetHeight - props.minPaneSize;
        }
        
        this.setState({firstPaneSize});
    };
    
    beginResize = e => {
        this.mouseOffset = this.props.direction === 'horizontal'
            ? e.clientX - this.handle.current.getBoundingClientRect().left - 8
            : e.clientY - this.handle.current.getBoundingClientRect().top - 8;
        
        window.addEventListener('mousemove', this.resize);
        window.addEventListener('mouseup', this.endResize);
    };
    
    endResize = () => {
        window.removeEventListener('mousemove', this.resize);
        window.removeEventListener('mouseup', this.endResize);
    };
    
    render() {
        const {props} = this;
        return (
            <div className={[
                    css['split-pane'],
                    css[props.direction]
                ].join(' ')}
                 ref={this.container}>
                <div style={{flexBasis: `${this.state.firstPaneSize}px`}}>
                    {props.children[0]}
                </div>
                <div className={css.spacer} />
                <div className={css.handle}
                     onMouseDown={this.beginResize}
                     style={props.direction === 'horizontal'
                        ? {left: `${this.state.firstPaneSize - 3}px`}
                        : {top: `${this.state.firstPaneSize - 3}px`}}
                     ref={this.handle}>
                    <div className={css['handle-visible']} />
                </div>
                {props.children[1]}
            </div>
        );
    }
}

SplitPane.defaultProps = {
    direction:   'horizontal',
    minPaneSize: 128
};
