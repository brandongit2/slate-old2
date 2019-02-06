import Link from 'next/link';

import {capitalizeFirstLetter} from '../../util';
import css from './Subject.scss';

const Subject = props => (
    <div className={css.subject}>
        <style jsx>{`
            --color: #${props.color}
        `}</style> {/* eslint-disable-line react/jsx-closing-tag-location */}
        <Link as={`/subject/${props.name}`} href={`/subject?subject=${props.name}`}>
            <a className={css.title}>
                {capitalizeFirstLetter(props.name)}
            </a>
        </Link>
        {props.courses.map(course => (
            <p key={course.name} className={css.course}>
                {course.name}
            </p>
        ))}
    </div>
);

Subject.defaultProps = {
    name:    '',
    color:   '888888',
    courses: []
};

export default Subject;
