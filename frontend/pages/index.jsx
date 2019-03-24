import Router from 'next/router';

export default function Index() {
    return <div>Index page</div>;
}

Index.getInitialProps = async ({req, res}) => {
    if (req) { // If being run on server
        res.writeHead(302, {Location: '/landing'});
        res.end();
    } else { // If being run on client
        Router.push('/landing');
    }
};
