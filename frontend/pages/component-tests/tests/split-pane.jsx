import {LoremIpsum} from 'lorem-ipsum';

import {SplitPane} from '../../../components';

import css from './split-pane.scss';

export default function SplitPaneTest() {
    const lorem = new LoremIpsum({});
    
    return (
        <div className={css['split-pane-test']}>
            <SplitPane>
                <div className={css.column}>
                    <p>{lorem.generateParagraphs(1)}</p>
                    <p>{lorem.generateParagraphs(1)}</p>
                    <p>{lorem.generateParagraphs(1)}</p>
                </div>
                <div className={css.column}>
                    <p>{lorem.generateParagraphs(1)}</p>
                    <p>{lorem.generateParagraphs(1)}</p>
                    <p>{lorem.generateParagraphs(1)}</p>
                </div>
            </SplitPane>
        </div>
    );
}
