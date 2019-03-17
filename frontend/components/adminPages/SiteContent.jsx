import React from 'react';

import css from './SiteContent.scss';

export function SiteContent() {
    const [currentTab, changeTab] = React.useState('subjects');
    
    // For clip-path transition trick
    const buttons = {
        subjects: React.useRef(null),
        courses:  React.useRef(null),
        units:    React.useRef(null),
        articles: React.useRef(null)
    };
    const getButtonLeft = () => {
        return buttons[currentTab].current
            ? buttons[currentTab].current.offsetLeft - parseInt(
                window.getComputedStyle(buttons[currentTab].current).getPropertyValue('padding-left'), 10
            ) : 0;
    };
    const getButtonRight = () => {
        return buttons[currentTab].current ? getButtonLeft() + buttons[currentTab].current.offsetWidth : 0;
    };
    
    return (
        <div className={css['site-content']}>
            <header>
                <h1>Site content manager</h1>
                <nav>
                    <ul>
                        <li className={currentTab === 'subjects' ? css.active : ''}
                            onClick={() => changeTab('subjects')}>
                            Subjects
                        </li>
                        <li className={currentTab === 'courses' ? css.active : ''}
                            onClick={() => changeTab('courses')}>
                            Courses
                        </li>
                        <li className={currentTab === 'units' ? css.active : ''}
                            onClick={() => changeTab('units')}>
                            Units
                        </li>
                        <li className={currentTab === 'articles' ? css.active : ''}
                            onClick={() => changeTab('articles')}>
                            Articles
                        </li>
                    </ul>
                    
                    <div className={css.highlight}>
                        {/* The clip-path is applied to this element in order to highlight current page. */}
                        <ul style={{clipPath: `polygon(${getButtonLeft()}px 0%, ${getButtonRight()}px 0%, ${getButtonRight()}px 100%, ${getButtonLeft()}px 100%)`}}>
                            <li className={currentTab === 'subjects' ? css.active : ''} ref={buttons.subjects}>
                                Subjects
                            </li>
                            <li className={currentTab === 'courses' ? css.active : ''} ref={buttons.courses}>
                                Courses
                            </li>
                            <li className={currentTab === 'units' ? css.active : ''} ref={buttons.units}>
                                Units
                            </li>
                            <li className={currentTab === 'articles' ? css.active : ''} ref={buttons.articles}>
                                Articles
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        </div>
    );
}
