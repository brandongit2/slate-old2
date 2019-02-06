import css from './Button.scss';

const Button = props => (
    <div id={css.button}>
        <span>
            <style jsx>{`
                --width: 1px;
            `}</style> {/* eslint-disable-line react/jsx-closing-tag-location */}
            <span>
                <span>
                    <span>{props.children}</span>
                </span>
            </span>
        </span>
    </div>
);

export default Button;
