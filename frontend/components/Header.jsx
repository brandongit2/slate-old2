import axios from 'axios';
import Link from 'next/link';
import Router from 'next/router';
import React from 'react';

import {Panel} from '../components';
import {ThemeContext, UserContext} from '../contexts';

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
    const {theme, toggleTheme} = React.useContext(ThemeContext);
    
    return (
        <header className={[css.header, props.float ? css.float : '', props.landingPage ? css.alt : ''].join(' ')}
                style={{
                    boxShadow:    props.noShadow ? 'none' : '0px 0px 30px var(--shadow-color)',
                    borderBottom: props.noShadow ? '1px solid var(--secondary-border-color)' : 'none'
                }}>
            <Link href="/">
                <a className={css['logo-container']} style={props.landingPage ? {marginLeft: '0px'} : {}}>
                    <img src="/static/slate-logo-light.svg"
                         alt="Slate logo"
                         className="logo"
                         style={{
                             height:   '100%',
                             position: 'absolute',
                             opacity:  props.landingPage ? '1' : (userInfo.isLoggedIn ? (theme === 'light' ? '0' : '1') : '0')
                         }} />
                    <img src="/static/slate-logo-dark.svg"
                         alt="Slate logo"
                         className="logo"
                         style={{
                             height:  '100%',
                             opacity: props.landingPage ? '0' : (userInfo.isLoggedIn ? (theme === 'light' ? '1' : '0') : '1')
                         }} />
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
                        <div className={[css.user, css[theme]].join(' ')}>
                            <Panel visible={(isOpen, {togglePanel}) => (
                                       /* eslint-disable-next-line react/jsx-indent */
                                       <div className={css['user-panel-visible']} onClick={togglePanel}>
                                           <span>{userInfo.first_name} {userInfo.last_name}</span>
                                           <i className="material-icons">{`arrow_drop_${isOpen ? 'up' : 'down'}`}</i>
                                       </div>
                                   )}
                                   hidden={isOpen => (
                                       <div className={[css['user-panel-container'], isOpen ? css.open : ''].join(' ')}>
                                           <div className={css['user-panel']}>
                                               <table><tbody>
                                                   <tr onClick={toggleTheme}>
                                                       <td><p>Dark mode</p></td>
                                                       <td>
                                                           <i className={[
                                                                  'material-icons',
                                                                  css.check,
                                                                  theme === 'dark' ? css.active : ''
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
                                                           await axios.post('http://localhost:3001/api/log-out', {}, {withCredentials: true});
                                                           Router.push('/');
                                                           setTimeout(() => window.location.reload(), 500);
                                                       }}>
                                                       <td><a>Log out</a></td>
                                                       <td></td>
                                                   </tr>
                                               </tbody></table>
                                           </div>
                                       </div>
                                   )} />
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
