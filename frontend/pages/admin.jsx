import {withRouter} from 'next/router';
import React from 'react';

import {Layout} from '../components';
import {UserContext} from '../contexts';
import * as pages from '../components/adminPages';

import css from './admin.scss';

function Admin(props) {
    const {userInfo} = React.useContext(UserContext);
    const triangle = React.useRef();
    
    let initialPage;
    switch (props.router.query.page) {
        case 'overview':
            initialPage = 'Overview';
            break;
        case 'site-content':
            initialPage = 'SiteContent';
            break;
        default:
            initialPage = 'Overview';
    }
    
    const [currentPage, setPage] = React.useState(initialPage);
    const [pagesLoaded, loadPage] = React.useReducer(
        (pagesLoaded, page) => (
            pagesLoaded.includes(page) ? pagesLoaded : [...pagesLoaded, page]
        ),
        [initialPage]
    );
    
    const icons = {};
    for (let page of Object.keys(pages)) {
        icons[page] = React.useRef(null);
    }
    
    const getTrianglePos = () => {
        if (typeof document != 'undefined' && icons[currentPage].current) {
            const iconPos = icons[currentPage].current.getBoundingClientRect().top;
            const iconHeight = icons[currentPage].current.getBoundingClientRect().height;
            const sidebarPos = document.querySelector(`.${css.sidebar}`).getBoundingClientRect().top;
            return iconPos - sidebarPos + iconHeight / 2 + 'px';
        } else {
            return 'calc(var(--icon-gap) + var(--icon-height) / 2 + (var(--icon-height) + var(--icon-gap)) * var(--triangle-pos))';
        }
    };
    
    const changePage = newPage => {
        // triangle.current.style.top = getTrianglePos();
        setPage(newPage);
        loadPage(newPage);
    };
    
    return (
        <Layout title="Admin panel - Slate" private minPerms={2}>
            <style jsx>{`
                --accent-color: ${userInfo.theme === 'light' ? '#111' : 'black'};
                --triangle-pos: ${Object.keys(icons).findIndex(pageName => pageName === currentPage)};
                --icon-height: 3rem;
                --icon-gap: 1.5rem;
            `}</style>
            <div className={css.admin}>
                <div className={css.sidebar}>
                    <div className={css.triangle}
                         style={{top: getTrianglePos()}} ref={triangle} />
                    <img src="/static/pie-chart.svg"
                         ref={icons.Overview}
                         className={currentPage === 'Overview' ? css.active : null}
                         onClick={() => {
                             changePage('Overview');
                             window.history.pushState({}, '', '/admin/overview');
                         }} />
                    <img src="/static/article.svg"
                         ref={icons.SiteContent}
                         className={currentPage === 'SiteContent' ? css.active : null}
                         onClick={() => {
                             changePage('SiteContent');
                             window.history.pushState({}, '', '/admin/site-content');
                         }} />
                </div>
                <div className={css.main}>
                    {pagesLoaded.map(pageName => {
                        const Page = pages[pageName];
                        return (
                            <div key={pageName}
                                 style={{
                                     position:  'absolute',
                                     width:     '100%',
                                     height:    '100%',
                                     transform: currentPage === pageName ? 'translateX(0px)' : 'translateX(100vw)'
                                 }}>
                                <Page initialTab={props.router.query.tab ? props.router.query.tab : 'Subjects'} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
}

Admin.defaultProps = {
    initialPage: 'Overview'
};

export default withRouter(Admin);
