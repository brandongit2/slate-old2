import Link from 'next/link';

import css from './Header.scss';

function Button(props) {
    return (
        <div className={css.button}>
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
}

// Keys are the text shown in the header, entries are the URL they lead to.
// example: 'blog' would link to slate.brandontsang.net/blog
const leftEntries = {
    subjects: 'subjects',
    about:    'about',
    blog:     'blog',
    donate:   'donate'
};
const rightEntries = {
    'log in': 'login',
    register: 'register'
};

const Header = props => (
    <div id={css.header}
         className={props.float ? css.float : ''}
         style={{
             boxShadow:    props.noShadow ? '' : '0px 0px 30px rgba(0, 0, 0, 0.1)',
             borderBottom: props.noShadow ? '1px solid #ddd' : 'none'
         }}>
        <Link href="/subjects">
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
    currentPage: '',
    float:       false
};

export default Header;
