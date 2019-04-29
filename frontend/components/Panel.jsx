/*
 * A pop-up panel which adjusts itself to stay on screen and disappears when it
 * falls off.
 */

import React from 'react';

import css from './Panel.scss';

export default class Panel extends React.Component {
    constructor(props) {
        super(props);
        
        this.panelContainer = React.createRef();
        this.visible = React.createRef();
        this.panel = React.createRef();
        
        this.state = {
            isOpen:        false,
            panelPosition: 0 // 0: down, 1: up
        };
        
        this.outerEvtListener = () => {
            this.setState({isOpen: false});
        };
        this.innerEvtListener = e => {
            e.stopPropagation();
        };
    }
    
    componentDidMount() {
        document.addEventListener('wheel', () => {
            if (this.state.isOpen && this.panel.current && this.visible.current) {
                const panel = this.panel.current.getBoundingClientRect();
                const visible = this.visible.current.getBoundingClientRect();
                if (panel.bottom > window.innerHeight && this.state.panelPosition === 0) {
                    this.setState({panelPosition: 1});
                } else if (this.state.panelPosition === 1 && visible.bottom + panel.height < window.innerHeight) {
                    this.setState({panelPosition: 0});
                }
            }
        });
    }
    
    openPanel = () => {
        this.setState({isOpen: true});
        window.addEventListener('mousedown', this.outerEvtListener);
        this.panel.current.addEventListener('mousedown', this.innerEvtListener);
        this.panelContainer.current.addEventListener('mousedown', this.innerEvtListener);
    };
    
    closePanel = () => {
        this.setState({isOpen: false});
        window.removeEventListener('mousedown', this.outerEvtListener);
        this.panel.current.removeEventListener('mousedown', this.innerEvtListener);
        this.panelContainer.current.removeEventListener('mousedown', this.innerEvtListener);
    };
    
    togglePanel = () => {
        const isOpen = !this.state.isOpen;
        
        if (isOpen) {
            this.openPanel();
        } else {
            this.closePanel();
        }
    };
    
    render() {
        const {props} = this;
        
        const controls = {
            openPanel:   this.openPanel,
            closePanel:  this.closePanel,
            togglePanel: this.togglePanel
        };
        
        return (
            <div className={[
                     css['panel-container'],
                     css[this.state.isOpen ? 'open' : 'closed']
                 ].join(' ')}
                 ref={this.panelContainer}>
                <div className={css.visible} ref={this.visible}>
                    {props.visible(this.state.isOpen, controls)}
                </div>
                <div className={css.panel}
                     ref={this.panel}
                     style={this.state.panelPosition === 0
                         ? {bottom: '0px', transform: 'translateY(100%)'}
                         : {top: '0px', transform: 'translateY(-100%)'}
                     }>
                    {props.hidden(this.state.isOpen, controls)}
                </div>
            </div>
        );
    }
}
