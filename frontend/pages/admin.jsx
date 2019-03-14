import React from 'react';
import {connect} from 'react-redux';

import {Layout} from '../components';
import * as pages from '../components/adminPages';

import css from './admin.scss';

function Admin(props) {
    const [currentPage, changePage] = React.useState('Overview');
    const Page = pages[currentPage];
    
    return (
        <Layout title="Admin panel - Slate" private minPerms={2} {...props}>
            <style jsx>{`${props.user.theme === 'light' ? `
                --accent-color: #111;
            ` : `
                --accent-color: black;
            `}`}</style>
            <div className={css.admin}>
                <div className={css.sidebar}>
                    <img src="/static/pie-chart.svg" onClick={() => changePage('Overview')} />
                    <img src="/static/article.svg" onClick={() => changePage('SiteContent')} />
                </div>
                <div className={css.main}>
                    <Page />
                </div>
            </div>
        </Layout>
    );
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

export default connect(mapStateToProps)(Admin);
