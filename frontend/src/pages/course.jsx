import {withRouter} from 'next/router';

import {Layout} from '../components';
import {kebabToProper} from '../util';

const Course = withRouter(props => (
    <Layout title={`${kebabToProper(props.router.query.course)} - Slate`}>
        <header>
            <p>COURSE</p>
            {props.router.query.course}
        </header>
    </Layout>
));

export default Course;
