/*
    Displays context on the right, with information like a title and description
    on the left. Used on subject and course pages.
*/

import Color from 'color';
import React from 'react';

import {ThemeContext} from '../contexts';
import {rgb, isTitleDark, isTitleLight} from '../util';

import css from './ContentContainer.scss';

export default function ContentContainer(props) {
    const {theme} = React.useContext(ThemeContext);
    
    const lightTheme = theme === 'light';
    const subjectColor = Color(props.color);
    
    return (
        <div className={css['content-container']}>
            <style jsx>{`
                --subject-color: ${props.color};
                --subject-title-color: ${
                    lightTheme
                        ? 'var(--subject-text-color)'
                        : (
                            isTitleDark(subjectColor)
                                ? 'var(--subject-text-color)'
                                : props.color
                        )
                };
                --subject-text-color: ${
                    lightTheme
                        ? (subjectColor.isLight() ? '#000' : '#fff')
                        : (
                            subjectColor.isDark()
                                ? 'var(--text-color)'
                                : props.color
                        )
                };
                --subject-background-color: ${lightTheme ? props.color : '#000'};
                --content-title-color: ${
                    (lightTheme ? isTitleLight(subjectColor) : isTitleDark(subjectColor))
                        ? 'var(--text-color)'
                        : rgb(subjectColor.rgb().array())
                };
            `}</style>
            {props.children}
        </div>
    );
}

export function InfoSection(props) {
    return (
        <div className={css['info-section']}>
            <div className={css.breadcrumbs}>{props.breadcrumbs}</div>
            <div className={css.info}>
                <p className={css.type}>{props.type}</p>
                <p className={css.title}>{props.title}</p>
                <p className={css.description}>{props.description}</p>
            </div>
        </div>
    );
}

export function ContentSection(props) {
    return (
        <div className={css['content-section']}>{props.children}</div>
    );
}
