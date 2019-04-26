import React from 'react';

import Subjects from './Subjects';
import Courses from './Courses';
import Units from './Units';
import Articles from './Articles';
import Comments from './Comments';

import css from './index.scss';

const tabs = {Subjects, Courses, Units, Articles, Comments};

export default class SiteContent extends React.Component {
    static defaultProps = {
        initialTab: 'Subjects'
    };
    
    constructor(props) {
        super(props);
        
        this.state = {
            currentTab: this.props.initialTab,
            tabsLoaded: [this.props.initialTab],
            queryQueue: []
        };
        
        this.buttons = {
            Subjects: React.createRef(),
            Courses:  React.createRef(),
            Units:    React.createRef(),
            Articles: React.createRef(),
            Comments: React.createRef()
        };
    }
    
    componentDidMount() {
        const url = `/admin/site-content?tab=${this.props.initialTab}`;
        const as = url;
        const options = {};
        window.history.replaceState({url, as, options}, null, url);
        
        // The clip path highlight relies on getButtonLeft() and
        // getButtonRight(), which don't have an effect server-side (as they
        // themselves rely on `document`). This forceUpdate() allows them to run
        // again with `document`.
        this.forceUpdate();
    }
    
    // Get the left position of the button for the current tab.
    getButtonLeft = () => {
        return this.buttons[this.state.currentTab].current
            ? this.buttons[this.state.currentTab].current.offsetLeft - parseInt(
                window.getComputedStyle(this.buttons[this.state.currentTab].current)
                    .getPropertyValue('padding-left'),
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
    
    changeTab = newTab => {
        const url = `/admin/site-content?tab=${newTab}`;
        const as = url;
        const options = {};
        window.history.replaceState({url, as, options}, null, url);
        
        this.setState({
            currentTab: newTab,
            tabsLoaded: this.state.tabsLoaded.includes(newTab)
                ? this.state.tabsLoaded
                : [...this.state.tabsLoaded, newTab]
        });
    };
    
    render() {
        return (
            <div className={css['site-content']}>
                <header>
                    <h1>Site content manager</h1>
                    <nav>
                        <ul>
                            <li onClick={() => this.changeTab('Subjects')}>
                                Subjects
                            </li>
                            <li onClick={() => this.changeTab('Courses')}>
                                Courses
                            </li>
                            <li onClick={() => this.changeTab('Units')}>
                                Units
                            </li>
                            <li onClick={() => this.changeTab('Articles')}>
                                Articles
                            </li>
                            <li onClick={() => this.changeTab('Comments')}>
                                Comments
                            </li>
                        </ul>
                        
                        <div className={css.highlight}>
                            {console.log(this.getButtonLeft(), this.getButtonRight())}
                            {/*
                                The clip-path is applied to this element in
                                order to highlight current page.
                            */}
                            <ul style={{clipPath: `
                                    polygon(
                                        ${this.getButtonLeft()}px 0%,
                                        ${this.getButtonRight()}px 0%,
                                        ${this.getButtonRight()}px 101%,
                                        ${this.getButtonLeft()}px 101%
                                    )
                                `}}>
                                <li ref={this.buttons.Subjects}>
                                    Subjects
                                </li>
                                <li ref={this.buttons.Courses}>
                                    Courses
                                </li>
                                <li ref={this.buttons.Units}>
                                    Units
                                </li>
                                <li ref={this.buttons.Articles}>
                                    Articles
                                </li>
                                <li ref={this.buttons.Comments}>
                                    Comments
                                </li>
                            </ul>
                        </div>
                    </nav>
                </header>
                <main>
                    {this.state.tabsLoaded.map(tabName => {
                        const Tab = tabs[tabName];
                        return (
                            <div key={tabName}
                                 style={{
                                     position:  'absolute',
                                     width:     '100%',
                                     transform: `translateY(${this.state.currentTab === tabName ? '0px' : '100vh'})`
                                 }}>
                                <Tab addToQueue={this.addToQueue} />
                            </div>
                        );
                    })}
                </main>
            </div>
        );
    }
}
