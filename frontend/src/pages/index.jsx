import Router from 'next/router';

const Index = () => <div>Index</div>;

Index.getInitialProps = async ({req, res}) => {
    if (req) { // If being run on server
        res.writeHead(302, {Location: '/subjects'});
        res.end();
    } else { // If being run on client
        Router.push('/subjects');
    }
};

export default Index;
