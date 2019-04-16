import {Layout} from '../components';
import React from 'react';
import axios from 'axios';
import {withRouter} from 'next/router';

class Deactivate extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            text: 'Attempting to deactivate your account...'
        };
    }

    async sendAPIDeactivate(query) {
        const apiRes = (await axios.post('/api/deactivate', {query})).data;
        return apiRes.success;
    }

    componentDidMount() {
        this.sendAPIDeactivate(this.props.router.query.query).then(res => {
            if (res) {
                this.setState({
                    text: 'Account successfully deactivated.'
                });
            } else {
                this.setState({
                    text: 'Account could not be deactivated. It may not exist.'
                });
            }
        });
    }

    render() {
        return (
            <Layout title="Account deactivated - Slate" noHeader secondaryLogo {...this.props}>
                <div style={{flexGrow: '1', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <b style={{fontSize: '16pt'}}>{this.state.text}</b>
                </div>
            </Layout>
        );
    }
}

export default withRouter(Deactivate);
