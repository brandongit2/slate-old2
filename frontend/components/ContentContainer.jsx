import Color from 'color';
import {connect} from 'react-redux';

import {rgb} from '../util';

import css from './ContentContainer.scss';

function ContentContainer(props) {
    const lightTheme = props.user.theme === 'light';
    const subjectColor = Color(props.color);
    
    return (
        <div className={css['content-container']}>
            <style jsx>{`
                --subject-color: ${rgb(subjectColor.rgb().array())};
                --subject-text-color: ${
                    lightTheme
                        ? (subjectColor.isLight() ? '#000' : '#fff')
                        : rgb(subjectColor.rgb().array())
                };
                --subject-background-color: ${lightTheme ? rgb(subjectColor.rgb().array()) : '#000'};
            `}</style>
            {props.children}
        </div>
    );
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

export default connect(mapStateToProps)(ContentContainer);

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
