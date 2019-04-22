import axios from 'axios';
import Link from 'next/link';
import Router from 'next/router';
import React from 'react';

import {UserContext} from '../contexts';

import css from './Header.scss';

export function Button(props) {
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
    const {userInfo} = React.useContext(UserContext);
    
    const [userPanelIsOpen, setUserPanelIsOpen] = React.useState(false);
    const toggleUserPanel = () => setUserPanelIsOpen(!userPanelIsOpen);
    
    return (
        <header className={[css.header, props.float ? css.float : '', props.landingPage ? css.alt : ''].join(' ')}
                style={{
                    boxShadow:    props.noShadow ? 'none' : '0px 0px 30px var(--shadow-color)',
                    borderBottom: props.noShadow ? '1px solid var(--secondary-border-color)' : 'none'
                }}>
            <Link href="/">
                <a id={css.logo}>
                    <img src="/static/slate-logo_white.svg" alt="Slate logo" className="bw-icon" style={{height: '100%'}} />
                </a>
            </Link>
            <nav>
                <ul id={css.links}>
                    <li className={props.currentPage === 'subjects' ? css.bold : ''}>
                        <Link href="/subjects"><a>
                            <Button>SUBJECTS</Button>
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
                    {userInfo.isLoggedIn ? (
                        <div id={css.user}
                             className={css[userInfo.theme]}
                             onBlur={() => setUserPanelIsOpen(false)}
                             tabIndex="0">
                            <div onClick={toggleUserPanel}>
                                <span>{userInfo.first_name} {userInfo.last_name}</span>
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
                                                        userInfo.theme === 'dark' ? css.active : ''
                                                    ].join(' ')}>
                                                    check
                                                </i>
                                            </td>
                                        </tr>
                                        <tr onClick={() => Router.push('/settings')}>
                                            <td><p>Settings</p></td>
                                            <td></td>
                                        </tr>
                                        {userInfo.permissions >= 2 ? (
                                            <React.Fragment>
                                                <tr>
                                                    <td onClick={() => Router.push('/admin')}>
                                                        <p>Admin panel</p>
                                                    </td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td onClick={() => Router.push('/component-tests')}>
                                                        <p>Component tests</p>
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            </React.Fragment>
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
