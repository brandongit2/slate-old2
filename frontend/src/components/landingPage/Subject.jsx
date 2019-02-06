import {capitalizeFirstLetter} from '../../util';
import css from './Subject.scss';

const Subject = props => (
    <div className={css.subject}>
        <style jsx>{`
            --color: #${props.color}
        `}</style> {/* eslint-disable-line react/jsx-closing-tag-location */}
        <span className={css.title}>
            {capitalizeFirstLetter(props.name)}
        </span>
        {props.courses.map(course => (
            <p key={course.name} className={css.course}>
                {course.name}
            </p>
        ))}
    </div>
);

Subject.defaultProps = {
    name:    '',
    courses: []
};

export default Subject;
