import axios from 'axios';
import Link from 'next/link';
import Router from 'next/router';
import React from 'react';
import {connect} from 'react-redux';

import {toggleTheme} from '../actions';

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

function Header(props) {
    const [userPanelIsOpen, setUserPanelIsOpen] = React.useState(false);
    const toggleUserPanel = () => setUserPanelIsOpen(!userPanelIsOpen);
    
    return (
        <header className={[css.header, props.float ? css.float : ''].join(' ')}
                style={{
                    boxShadow:    props.noShadow ? 'none' : '0px 0px 30px var(--shadow-color)',
                    borderBottom: props.noShadow ? '1px solid var(--secondary-border-color)' : 'none'
                }}>
            <Link href="/subjects">
                <a id={css.logo}>
                    <img src="/static/slate-logo.svg" alt="Slate logo" className="bw-icon" style={{height: '100%'}} />
                </a>
            </Link>
            <nav>
                <ul id={css.links}>
                    <li className={props.currentPage === 'subjects' ? css.bold : ''}>
                        <Link href="/subjects"><a>
                            <Button>SUBJECTS</Button>
                        </a></Link>
                    </li>
                    <li className={props.currentPage === 'about' ? css.bold : ''}>
                        <Link href="/about"><a>
                            <Button>ABOUT</Button>
                        </a></Link>
                    </li>
                    <li className={props.currentPage === 'blog' ? css.bold : ''}>
                        <Link href="/blog"><a>
                            <Button>BLOG</Button>
                        </a></Link>
                    </li>
                    <li className={props.currentPage === 'donate' ? css.bold : ''}>
                        <Link href="/donate"><a>
                            <Button>DONATE</Button>
                        </a></Link>
                    </li>
                </ul>
                <div id={css['right-buttons']}>
                    {props.user.isLoggedIn ? (
                        <div id={css.user}
                             className={css[props.user.theme]}
                             onBlur={() => setUserPanelIsOpen(false)}
                             tabIndex="0">
                            <div onClick={toggleUserPanel}>
                                <span>{props.user.first_name} {props.user.last_name}</span>
                                <i className="material-icons">arrow_drop_down</i>
                            </div>
                            <div id={css['user-panel-container']} className={userPanelIsOpen ? css.open : ''}>
                                <div className={css['user-panel']}>
                                    <table><tbody>
                                        <tr onClick={props.toggleTheme}>
                                            <td><p>Dark mode</p></td>
                                            <td>
                                                <i className={[
                                                        'material-icons',
                                                        css.check,
                                                        props.user.theme === 'dark' ? css.active : ''
                                                    ].join(' ')}>
                                                    check
                                                </i>
                                            </td>
                                        </tr>
                                        <tr onClick={() => Router.push('/settings')}>
                                            <td><p>Settings</p></td>
                                            <td></td>
                                        </tr>
                                        {props.user.permissions >= 2 ? (
                                            <tr>
                                                <td onClick={() => Router.push('/admin')}><p>Admin panel</p></td>
                                                <td></td>
                                            </tr>
                                        ) : null}
                                        <tr onClick={async () => {
                                                await axios.post('/api/log-out');
                                                Router.push('/');
                                                setTimeout(() => window.location.reload(), 500);
                                            }}>
                                            <td><a>Log out</a></td>
                                            <td></td>
                                        </tr>
                                    </tbody></table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <ul>
                            <li className={props.currentPage === 'log in' ? css.bold : ''}>
                                <Link href="/log-in"><a>
                                    <Button>LOG IN</Button>
                                </a></Link>
                            </li>
                            <li className={props.currentPage === 'register' ? css.bold : ''}>
                                <Link href="/register"><a>
                                    <Button>REGISTER</Button>
                                </a></Link>
                            </li>
                        </ul>
                    )}
                </div>
            </nav>
        </header>
    );
}

const actionCreators = {
    toggleTheme
};

export default connect(null, actionCreators)(Header);
