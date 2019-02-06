import Router from 'next/router';
import React from 'react';

export default class Index extends React.Component {
    static async getInitialProps({req, res}) {
        if (req) { // If being run on server
            res.writeHead(302, {Location: '/courses'});
            res.end();
        } else { // If being run on client
            Router.push('/couses');
        }
    }
}
