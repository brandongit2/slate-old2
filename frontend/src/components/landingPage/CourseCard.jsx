import React from 'react';

import css from './CourseCard.scss';

class CourseCard extends React.Component {
    handleMouseEnter = () => {
        this.props.onHover(this.props.name);
    };

    handleMouseLeave = () => {
        this.props.onLeave();
    };

    render() {
        const {props} = this;
        return (
            <div className={css['course-card']}
                 onMouseEnter={this.handleMouseEnter}
                 onMouseLeave={this.handleMouseLeave}>
                <span className={css.title}>{props.name.toUpperCase()}</span>
            </div>
        );
    }
}

export default CourseCard;
