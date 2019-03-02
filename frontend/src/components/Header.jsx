import Link from 'next/link';
import React from 'react';

import css from './Header.scss';

function Button(props) {
    return (
        <div className={css.button}>
            <span>
                <style jsx>{`
                    --width: 1px;
                `}</style>
                <span>
                    <span>
                        <span>{props.children}</span>
                    </span>
                </span>
            </span>
        </div>
    );
}

export default function Header(props) {
    return (
        <div id={css.header}
             className={props.float ? css.float : ''}
             style={{
                 boxShadow:    props.noShadow ? 'none' : '0px 0px 30px rgba(0, 0, 0, 0.1)',
                 borderBottom: props.noShadow ? '1px solid #ddd' : 'none'
             }}>
            <Link href="/subjects">
                <a id={css.logo}>
                    <img src="/static/slate-logo.svg" alt="Slate logo" style={{height: '100%'}} />
                </a>
            </Link>
            <nav>
                <ul id={css.links}>
                    <li className={props.currentPage === 'subjects' ? css.bold : ''}>
                        <Link href="/subjects" prefetch><a>
                            <Button>SUBJECTS</Button>
                        </a></Link>
                    </li>
                    <li className={props.currentPage === 'about' ? css.bold : ''}>
                        <Link href="/about" prefetch><a>
                            <Button>ABOUT</Button>
                        </a></Link>
                    </li>
                    <li className={props.currentPage === 'blog' ? css.bold : ''}>
                        <Link href="/blog" prefetch><a>
                            <Button>BLOG</Button>
                        </a></Link>
                    </li>
                    <li className={props.currentPage === 'donate' ? css.bold : ''}>
                        <Link href="/donate" prefetch><a>
                            <Button>DONATE</Button>
                        </a></Link>
                    </li>
                </ul>
                <ul id={css.actions}>
                    <li className={props.currentPage === 'login' ? css.bold : ''}>
                        <Link href="/login" prefetch><a>
                            <Button>LOG IN</Button>
                        </a></Link>
                    </li>
                    <li className={props.currentPage === 'register' ? css.bold : ''}>
                        <Link href="/register" prefetch><a>
                            <Button>REGISTER</Button>
                        </a></Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

Header.defaultProps = {
    currentPage: '',
    float:       false
};
