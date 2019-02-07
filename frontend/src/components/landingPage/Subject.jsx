import Router from 'next/router';
import {connect} from 'react-redux';

import {changeSubject, changeCourse} from '../../actions';
import {kebabToProper} from '../../util';
import css from './Subject.scss';

const Subject = props => (
    <div className={css.subject}>
        <style jsx>{`
            --color: #${props.color}
        `}</style> {/* eslint-disable-line react/jsx-closing-tag-location */}
        <a className={css.title}
           onClick={() => {
               props.changeSubject(props.name);
               Router.push(
                   `/subject?subject=${props.name}`,
                   `/subject/${props.name}`
               );
           }}>
            {kebabToProper(props.name)}
        </a>
        {props.courses.map(course => (
            <a key={course.name}
               className={css.course}
               onClick={() => {
                   props.changeCourse(course.name);
                   Router.push(
                       `/course?course=${course.name}`,
                       `/course/${props.name}/${course.name}`
                   );
               }}>
                {kebabToProper(course.name)}
            </a>
        ))}
    </div>
);

Subject.defaultProps = {
    name:    '',
    color:   '888888',
    courses: []
};

const mapDispatchToProps = dispatch => ({
    changeSubject: newSubject => dispatch(changeSubject(newSubject)),
    changeCourse:  newCourse => dispatch(changeCourse(newCourse))
});

export default connect(null, mapDispatchToProps)(Subject);
