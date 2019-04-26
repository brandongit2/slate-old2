import axios from 'axios';
import NextApp, {Container} from 'next/app';
import Router from 'next/router';
import React from 'react';
import {generate} from 'shortid';

import {severities} from '../constants';
import {ModalContext, NotificationsContext, SlateInfoContext, ThemeContext, UserContext} from '../contexts';

import {rootUrl} from '../config.json';
import './_app.scss';

// https://github.com/zeit/next-plugins/issues/282#issuecomment-432127816
Router.events.on('routeChangeComplete', () => {
    if (process.env.NODE_ENV !== 'production') {
        const els = document.querySelectorAll('link[href*="/_next/static/css/styles.chunk.css"]');
        const timestamp = new Date().valueOf();
        els[0].href = `/_next/static/css/styles.chunk.css?v=${timestamp}`;
    }
});

export default class Slate extends NextApp {
    static async getInitialProps({Component, ctx}) {
        axios.defaults.baseUrl = rootUrl;
        
        let pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
        if (pageProps == null) pageProps = {};
        
        let userInfo;
        if (ctx.req) {
            let user = (await axios.request({
                url:     '/api/authenticate',
                method:  'post',
                headers: {
                    Cookie: `authToken=${ctx.req.cookies.authToken};`
                }
            })).data;
            if (user.success) {
                userInfo = {
                    ...user.user,
                    isLoggedIn: true
                };
            } else {
                userInfo = {
                    isLoggedIn: false
                };
            }
        }
        
        return {pageProps, userInfo};
    }
    
    constructor(props) {
        super(props);
        
        this.state = {
            modal: {
                isVisible: false,
                title:     '',
                content:   '',
                buttons:   [],
                hasX:      true
            },
            showModal: (title, content, buttons, hasX = true) => {
                this.setState({
                    modal: {
                        isVisible: true,
                        title, content, buttons, hasX
                    }
                });
            },
            hideModal: () => {
                this.setState({
                    modal: {
                        ...this.state.modal,
                        isVisible: false
                    }
                });
            },
            
            notifications:   {},
            addNotification: (text, level = severities.INFO, timeout = 5000) => {
                const id = generate();
                
                setTimeout(() => {
                    this.state.removeNotification(id);
                }, timeout);
                
                this.setState({
                    notifications: {
                        ...this.state.notifications,
                        [id]: {text, level, timeout}
                    }
                });
            },
            removeNotification: id => {
                // Take out the notification with key `id` from this.state.notifications
                const filteredNotificationIds = Object.keys(this.state.notifications).filter(i => i !== id);
                let newNotificationList = {};
                filteredNotificationIds.map(id => {
                    newNotificationList[id] = this.state.notifications[id];
                });
                this.setState({
                    notifications: newNotificationList
                });
            },
            
            slateInfo: {
                version:     process.env.version,
                publishDate: process.env.publishDate
            },
            
            theme:       this.props.userInfo.isLoggedIn ? this.props.userInfo.theme : 'light',
            toggleTheme: () => {
                const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
                
                if (this.props.userInfo.isLoggedIn) {
                    axios.post('/api/settings/toggle-theme');
                    
                    this.setState({
                        userInfo: {
                            ...this.state.userInfo,
                            theme: newTheme
                        },
                        theme: newTheme
                    });
                } else {
                    this.setState({
                        theme: newTheme
                    });
                }
            },
            
            userInfo:    this.props.userInfo,
            setUserInfo: newInfo => {
                this.setState({userInfo: newInfo});
            }
        };
    }
    
    render() {
        const {Component, pageProps} = this.props;
        return (
            <Container>
                <UserContext.Provider value={{
                    userInfo:    this.state.userInfo,
                    setUserInfo: this.state.setUserInfo
                }}>
                    <ThemeContext.Provider value={{
                        theme:       this.state.theme,
                        toggleTheme: this.state.toggleTheme
                    }}>
                        <ModalContext.Provider value={{
                            modal:     this.state.modal,
                            showModal: this.state.showModal,
                            hideModal: this.state.hideModal
                        }}>
                            <NotificationsContext.Provider value={{
                                notifications:      this.state.notifications,
                                addNotification:    this.state.addNotification,
                                removeNotification: this.state.removeNotification
                            }}>
                                <SlateInfoContext.Provider value={this.state.slateInfo}>
                                    <Component {...pageProps} />
                                </SlateInfoContext.Provider>
                            </NotificationsContext.Provider>
                        </ModalContext.Provider>
                    </ThemeContext.Provider>
                </UserContext.Provider>
            </Container>
        );
    }
}
