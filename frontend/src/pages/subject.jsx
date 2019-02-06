import {withRouter} from 'next/router';

import {Layout} from '../components';

const Subject = withRouter(props => (
    <Layout currentPage="" title="Subject - Slate">
        {props.router.query.subject}
    </Layout>
));

export default Subject;
