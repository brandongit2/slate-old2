import Link from 'next/link';

import {Button} from './';
import css from './Header.scss';

// Keys are the text shown in the header, entries are the URL they lead to.
// example: 'blog' would link to slate.brandontsang.net/blog
const leftEntries = {
    courses: 'courses',
    about:   'about',
    blog:    'blog',
    donate:  'donate'
};
const rightEntries = {
    'log in': 'login',
    register: 'register'
};

const Header = props => (
    <div id={css.header}
         className={props.float ? css.float : ''}>
        <Link href="/courses">
            <a id={css.logo}>
                <img src="/static/slate-logo.svg" alt="Slate logo" style={{height: '100%'}} />
            </a>
        </Link>
        <nav>
            <ul id={css.links}>
                {Object.keys(leftEntries).map(entry => (
                    <li key={entry} className={props.currentPage === entry ? css.bold : ''}>
                        <Link href={'/' + leftEntries[entry]} prefetch>
                            <a>
                                <Button>{entry.toUpperCase()}</Button>
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
            <ul id={css.actions}>
                {Object.keys(rightEntries).map(entry => (
                    <li key={entry} className={props.currentPage === entry ? css.bold : ''}>
                        <Link href={'/' + rightEntries[entry]} prefetch>
                            <a>
                                <Button>{entry.toUpperCase()}</Button>
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    </div>
);

Header.defaultProps = {
    currentPage:     '',
    backgroundColor: '#ffffff',
    textColor:       '#000000',
    float:           false
};

export default Header;
