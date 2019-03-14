import {connect} from 'react-redux';

import {Layout} from '../components';

import css from './admin.scss';

function Admin(props) {
    return (
        <Layout title="Admin - Slate" private minPerms={2} {...props}>
            <style jsx>{`${props.user.theme === 'light' ? `
                --accent-color: #111;
            ` : `
                --accent-color: black;
            `}`}</style>
            <div className={css.sidebar}></div>
        </Layout>
    );
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

export default connect(mapStateToProps)(Admin);
