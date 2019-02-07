import {withRouter} from 'next/router';
import {connect} from 'react-redux';

import {Layout} from '../components';
import {kebabToProper} from '../util';
import css from './subject.scss';

const Subject = withRouter(props => (
    <Layout currentPage=""
            title={kebabToProper(props.router.query.subject) + ' - Slate'}>
        <style jsx>{`
            --color: red;
        `}</style> {/* eslint-disable-line react/jsx-closing-tag-location */}
        <div id={css.container}>
            <header>
                <p id={css['label-courses']}>SUBJECT</p>
                <p id={css.title}>{kebabToProper(props.router.query.subject)}</p>
            </header>
        </div>
    </Layout>
));

const mapStateToProps = state => ({
    currentSubject: state.currentSubject
});

export default connect(mapStateToProps)(Subject);
