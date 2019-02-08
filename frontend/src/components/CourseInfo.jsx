import css from './CourseInfo.scss';

const CourseInfo = props => (
    <div id={css.container}>
        <p id={css.name}>{props.name}</p>
        <p id={css.description}>{props.description}</p>
        {props.units.map(unit => (
            // Sometimes unit is `undefined` lol
            unit ? <p key={unit.name} className={css.unit}>{unit.name}</p> : null
        ))}
    </div>
);

export default CourseInfo;
