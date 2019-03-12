import {Layout} from '../components';

export default function Error(props) {
    return <Layout err={props.statusCode} />;
}

Error.getInitialProps = ({res, err}) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return {statusCode};
};
