import SimpleBar from 'simplebar-react';

import css from './simplebar.scss';

export default function SimpleBarTest() {
    return (
        <div className={css['simplebar-test']}>
            <SimpleBar className={css.simplebar}>
                {(() => {
                    let rows = [];
                    for (let i = 0; i < 100; i++) {
                        rows.push(
                            <div key={i} className={css.row}>Row {i}</div>
                        );
                    }
                    return rows;
                })()}
            </SimpleBar>
        </div>
    );
}
