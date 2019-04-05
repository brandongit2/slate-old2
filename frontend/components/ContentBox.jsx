import css from './ContentBox.scss';

export default function ContentBox(props) {
    return (
        <div className={css['content-box']}>
            <style jsx>{`
                --color: ${props.color};
            `}</style>
            <h1>{props.title}</h1>
            <p className={css.description}>{props.description}</p>
        </div>
    );
}

ContentBox.defaultProps = {
    title:       '',
    description: ''
};
