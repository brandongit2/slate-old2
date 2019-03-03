import {Layout} from '../components';

import css from './settings.scss';

export default function Settings() {
    return (
        <Layout>
            <div id={css.container}>
                <h1>Settings</h1>
                <div className={css.box}>
                    <span className={css['box-header']}>Personal info</span>
                    <form>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: '1rem'}}>
                            <div className="form-field">
                                <label htmlFor="email">First name</label>
                                <input type="text" name="email"></input>
                            </div>
                            
                            <div className="form-field">
                                <label htmlFor="email">Last name</label>
                                <input type="text" name="email"></input>
                            </div>
                        </div>
                        
                        <div className="form-field">
                            <label htmlFor="email">E-mail</label>
                            <input type="text" name="email"></input>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
