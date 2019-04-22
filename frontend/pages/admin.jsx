import {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';

import {Layout} from '../components';
import * as pages from '../components/adminPages';

import css from './admin.scss';

function Admin(props) {
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
    
    const changePage = newPage => {
        setPage(newPage);
        loadPage(newPage);
    };
    
    const icons = {};
    for (let page of Object.keys(pages)) {
        icons[page] = React.useRef(null);
    }
    
    const getTrianglePos = () => {
        const iconPos = icons[currentPage].current
            ? icons[currentPage].current.getBoundingClientRect().top : 0;
        const iconHeight = icons[currentPage].current
            ? icons[currentPage].current.getBoundingClientRect().height : 0;
        const sidebarPos =
            typeof document != 'undefined' && document.querySelector(`.${css.sidebar}`)
                ? document.querySelector(`.${css.sidebar}`).getBoundingClientRect().top : 0;
        return iconPos - sidebarPos + iconHeight / 2;
    };
    
    return (
        <Layout title="Admin panel - Slate" private minPerms={2}>
            <style jsx>{`${props.user.theme === 'light' ? `
                --accent-color: #111;
            ` : `
                --accent-color: black;
            `}`}</style>
            <div className={css.admin}>
                <div className={css.sidebar}>
                    <div id={css.triangle}
                         style={{top: `${getTrianglePos()}px`}} />
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

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

export default connect(mapStateToProps)(withRouter(Admin));
