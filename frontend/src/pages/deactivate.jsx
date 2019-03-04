import {Layout} from '../components';

export default function Deactivate() {
    return (
        <Layout title="Account deactivated - Slate" noHeader secondaryLogo>
            <div style={{flexGrow: '1', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <b style={{fontSize: '16pt'}}>Account successfully deactivated.</b>
            </div>
        </Layout>
    );
}
