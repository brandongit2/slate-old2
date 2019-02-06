import {Button} from './';
import css from './Header.scss';

const leftEntries = [
    'courses',
    'about',
    'blog',
    'donate'
];

const rightEntries = [
    'sign in',
    'register'
];

const Header = props => (
    <div id={css.header} className={props.float ? css.float : ''}>
        <img src="/static/slate-logo.svg" alt="Slate logo" />
        <nav>
            <ul id={css.links}>
                {leftEntries.map(entry => (
                    <li key={entry} className={props.currentPage === entry ? css.bold : ''}>
                        <Button>{entry.toUpperCase()}</Button>
                    </li>
                ))}
            </ul>
            <ul id={css.actions}>
                {rightEntries.map(entry => (
                    <li key={entry} className={props.currentPage === entry ? css.bold : ''}>
                        <Button>{entry.toUpperCase()}</Button>
                    </li>
                ))}
            </ul>
        </nav>
    </div>
);

Header.defaultProps = {
    currentPage: 'courses',
    float:       false
};

export default Header;
