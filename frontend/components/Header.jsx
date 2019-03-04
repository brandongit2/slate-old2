import axios from 'axios';
import Link from 'next/link';
import Router from 'next/router';
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

function UserPanel(props) {
    return (
        <div className={[css['user-panel'], 'user-panel'].join(' ')}>
            <a onClick={() => Router.push('/settings')}>Settings</a>
            {props.user.permissions > 1 ? <a onClick={() => Router.push('/admin')}>Admin panel</a> : null}
            <a onClick={async () => {
                   await axios.post('/api/log-out');
                   window.location.reload();
               }}>Log out</a>
        </div>
    );
}

export default function Header(props) {
    const [userPanelIsOpen, setUserPanelIsOpen] = React.useState(false);
    const toggleUserPanel = () => setUserPanelIsOpen(!userPanelIsOpen);
    
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
                {props.user.isLoggedIn ? (
                    <div id={css.user}
                         onBlur={() => setUserPanelIsOpen(false)}
                         tabIndex="0">
                        <div className="user-panel-visible" onClick={toggleUserPanel}>
                            <span>{props.user.first_name} {props.user.last_name}</span>
                            <i className="material-icons">arrow_drop_down</i>
                        </div>
                        <div id={css['user-panel-container']} className={userPanelIsOpen ? css.open : ''}>
                            <UserPanel user={props.user} />
                        </div>
                    </div>
                ) : (
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
                )}
            </nav>
        </div>
    );
}

Header.defaultProps = {
    currentPage: '',
    float:       false
};
