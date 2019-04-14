/*
 * This component renders two child components next to each other, with a
 * separating bar which can be dragged to grow/shrink the children.
 */

import css from './SplitContainer.scss';

// props.direction can be either 'horizontal' or 'vertical'.
export default function SplitContainer(props) {
    return (
        <div className={[
                 css['split-container'],
                 css[props.direction]
             ].join(' ')}>
            {props.children}
        </div>
    );
}

SplitContainer.defaultProps = {
    direction: 'horizontal'
};
