import css from './buttons.scss';

export default function ButtonTest() {
    return (
        <div className={css['button-test']}>
            <button>Regular plain-old boring button</button>
            <button className="low">Low-severity button</button>
            <button className="med">Medium-severity button</button>
            <button className="high">High-severity button</button>
        </div>
    );
}
