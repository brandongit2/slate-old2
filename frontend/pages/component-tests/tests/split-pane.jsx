import {LoremIpsum} from 'lorem-ipsum';
import React from 'react';

import {Dropdown, SplitPane} from '../../../components';
import {Item} from '../../../components/Dropdown';

import css from './split-pane.scss';

export default function SplitPaneTest() {
    const lorem = new LoremIpsum({});
    
    const [direction, setDirection] = React.useState('horizontal');
    
    return (
        <div className={css['split-pane-test']}>
            <div className={css.dropdown}>
                <Dropdown label="Horizontal">
                    <Item onClick={() => setDirection('horizontal')}>Horizontal</Item>
                    <Item onClick={() => setDirection('vertical')}>Vertical</Item>
                </Dropdown>
            </div>
            <div className={css['split-pane']}>
                <SplitPane direction={direction}>
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
        </div>
    );
}
