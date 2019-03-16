import React from 'react';
import {connect} from 'react-redux';

import {Layout} from '../components';
import * as pages from '../components/adminPages';

import css from './admin.scss';

function Admin(props) {
    const [currentPage, changePage] = React.useState(props.initialPage);
    const Page = pages[currentPage];
    
    const icons = {};
    for (let page of Object.keys(pages)) {
        icons[page] = React.useRef(null);
    }
    
    const getTrianglePos = () => {
        const iconPos = icons[currentPage].current ? icons[currentPage].current.getBoundingClientRect().top : 0;
        const iconHeight = icons[currentPage].current ? icons[currentPage].current.getBoundingClientRect().height : 0;
        const sidebarPos = typeof document != 'undefined' && document.querySelector(`.${css.sidebar}`)
            ? document.querySelector(`.${css.sidebar}`).getBoundingClientRect().top : 0;
        return iconPos - sidebarPos + iconHeight / 2;
    };
    
    return (
        <Layout title="Admin panel - Slate" private minPerms={2} {...props}>
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
                    <Page />
                </div>
            </div>
        </Layout>
    );
}

Admin.defaultProps = {
    initialPage: 'Overview'
};

Admin.getInitialProps = async ({req}) => {
    if (typeof req === 'undefined') return {};
    switch (req.params.page) {
        case 'overview':
            return {initialPage: 'Overview'};
        case 'site-content':
            return {initialPage: 'SiteContent'};
        default:
            return {};
    }
};

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

export default connect(mapStateToProps)(Admin);
