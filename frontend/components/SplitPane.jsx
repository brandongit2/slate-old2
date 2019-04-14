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
    
    resize = e => {
        const {props} = this;
        
        let firstPaneSize = props.direction === 'horizontal'
            ? e.clientX - this.container.current.getBoundingClientRect().left - this.mouseOffset
            : e.clientY - this.container.current.getBoundingClientRect().top - this.mouseOffset;
        
        if (firstPaneSize < props.minPaneSize) {
            firstPaneSize = props.minPaneSize;
        } else if (firstPaneSize > this.container.current.offsetWidth - props.minPaneSize) {
            firstPaneSize = this.container.current.offsetWidth - props.minPaneSize;
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
                <div className={css.handle}
                     onMouseDown={this.beginResize}
                     style={props.direction === 'horizontal'
                        ? {left: `${this.state.firstPaneSize - 8}px`}
                        : {top: `${this.state.firstPaneSize - 8}px`}}
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
