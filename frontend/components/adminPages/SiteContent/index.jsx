import React from 'react';
import {connect} from 'react-redux';

import Subjects from './Subjects';
import {getAllSubjects} from '../../../actions';

import css from './index.scss';

class SiteContent extends React.Component {
    state = {
        currentTab: 'subjects',
        queryQueue: []
    };
    
    constructor(props) {
        super(props);
        
        this.buttons = {
            subjects: React.createRef(),
            courses:  React.createRef(),
            units:    React.createRef(),
            articles: React.createRef(),
            comments: React.createRef()
        };
        
        props.dispatch(getAllSubjects());
    }
    
    // Get the left position of the button for the current tab.
    getButtonLeft = () => {
        return this.buttons[this.state.currentTab].current
            ? this.buttons[this.state.currentTab].current.offsetLeft - parseInt(
                window.getComputedStyle(this.buttons[this.state.currentTab].current).getPropertyValue('padding-left'),
                10
            ) : 0;
    };
    
    // Get the right position of the button for the current tab.
    getButtonRight = () => {
        return this.buttons[this.state.currentTab].current
            ? this.getButtonLeft() + this.buttons[this.state.currentTab].current.offsetWidth
            : 0;
    };
    
    addToQueue = query => {
        this.setState({
            queryQueue: [...this.state.queryQueue, query]
        });
    };
    
    render() {
        return (
            <div className={css['site-content']}>
                <header>
                    <h1>Site content manager</h1>
                    <nav>
                        <ul>
                            <li onClick={() => this.setState({currentTab: 'subjects'})}>
                                Subjects
                            </li>
                            <li onClick={() => this.setState({currentTab: 'courses'})}>
                                Courses
                            </li>
                            <li onClick={() => this.setState({currentTab: 'units'})}>
                                Units
                            </li>
                            <li onClick={() => this.setState({currentTab: 'articles'})}>
                                Articles
                            </li>
                            <li onClick={() => this.setState({currentTab: 'comments'})}>
                                Comments
                            </li>
                        </ul>
                        
                        <div className={css.highlight}>
                            {/* The clip-path is applied to this element in order to highlight current page. */}
                            <ul style={{clipPath: `polygon(${this.getButtonLeft()}px 0%, ${this.getButtonRight()}px 0%, ${this.getButtonRight()}px 101%, ${this.getButtonLeft()}px 101%)`}}>
                                <li ref={this.buttons.subjects}>
                                    Subjects
                                </li>
                                <li ref={this.buttons.courses}>
                                    Courses
                                </li>
                                <li ref={this.buttons.units}>
                                    Units
                                </li>
                                <li ref={this.buttons.articles}>
                                    Articles
                                </li>
                                <li ref={this.buttons.comments}>
                                    Comments
                                </li>
                            </ul>
                        </div>
                    </nav>
                </header>
                <main className={css[this.state.currentTab]}>
                    {(() => {
                        switch (this.state.currentTab) {
                            case 'subjects':
                                return <Subjects addToQueue={this.addToQueue} />;
                            default:
                                return <div />;
                        }
                    })()}
                </main>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        subjects: state.subjects
    };
}

export default connect(mapStateToProps)(SiteContent);
