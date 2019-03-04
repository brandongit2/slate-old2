import {Layout} from '../components';

export default function Deactivate(props) {
    return (
        <Layout title="Account deactivated - Slate" noHeader secondaryLogo {...props}>
            <div style={{flexGrow: '1', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <b style={{fontSize: '16pt'}}>Account successfully deactivated.</b>
            </div>
        </Layout>
    );
}
