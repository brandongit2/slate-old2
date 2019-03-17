import React from 'react';

import css from './SiteContent.scss';

export function SiteContent() {
    const [currentTab, changeTab] = React.useState('subjects');
    
    const buttons = {
        subjects: React.useRef(),
        courses:  React.useRef(),
        units:    React.useRef(),
        articles: React.useRef()
    };
    
    const getButtonLeft = () => {
        return buttons[currentTab].current
            ? buttons[currentTab].current.offsetLeft - parseInt(
                window.getComputedStyle(buttons[currentTab].current).getPropertyValue('padding-left'), 10
            ) : 0;
    };
    
    const getButtonRight = () => {
        return buttons[currentTab].current
            ? getButtonLeft() + buttons[currentTab].current.offsetWidth
            : 0;
    };
    
    return (
        <div className={css['site-content']}>
            <header>
                <h1>Site content manager</h1>
                <nav>
                    <ul>
                        <li onClick={() => changeTab('subjects')}>
                            Subjects
                        </li>
                        <li onClick={() => changeTab('courses')}>
                            Courses
                        </li>
                        <li onClick={() => changeTab('units')}>
                            Units
                        </li>
                        <li onClick={() => changeTab('articles')}>
                            Articles
                        </li>
                    </ul>
                    
                    <div className={css.highlight}>
                        {/* The clip-path is applied to this element in order to highlight current page. */}
                        <ul style={{clipPath: `polygon(${getButtonLeft()}px 0%, ${getButtonRight()}px 0%, ${getButtonRight()}px 100%, ${getButtonLeft()}px 100%)`}}>
                            <li ref={buttons.subjects}>
                                Subjects
                            </li>
                            <li ref={buttons.courses}>
                                Courses
                            </li>
                            <li ref={buttons.units}>
                                Units
                            </li>
                            <li ref={buttons.articles}>
                                Articles
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        </div>
    );
}
