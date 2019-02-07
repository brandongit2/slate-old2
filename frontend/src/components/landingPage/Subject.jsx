import Link from 'next/link';

import {kebabToProper} from '../../util';
import css from './Subject.scss';

const Subject = props => (
    <div className={css.subject}>
        <style jsx>{`
            --color: #${props.color}
        `}</style> {/* eslint-disable-line react/jsx-closing-tag-location */}
        <Link href={`/subject?subject=${props.id}`}
              as={`/subject/${props.name}`}>
            <a className={css.title}>
                {kebabToProper(props.name)}
            </a>
        </Link>
        {props.courses.map(course => (
            <Link key={course.name}
                  href={`/course?course=${course.id}`}
                  as={`/subject/${props.name}/${course.name}`}>
                <a className={css.course}>
                    {kebabToProper(course.name)}
                </a>
            </Link>
        ))}
    </div>
);

Subject.defaultProps = {
    name:    '',
    color:   '888888',
    courses: []
};

export default Subject;
