import {Loading} from '../../../components';

import css from './loading-spinner.scss';

export default function LoadingSpinner() {
    return (
        <div className={css['loading-spinner-test']}>
            <Loading />
        </div>
    );
}
