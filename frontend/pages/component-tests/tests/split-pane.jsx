import {LoremIpsum} from 'lorem-ipsum';
import React from 'react';

import {Dropdown, SplitPane} from '../../../components';
import {Item} from '../../../components/Dropdown';

import css from './split-pane.scss';

const lorem = new LoremIpsum({});
const firstColText = [
    lorem.generateParagraphs(1),
    lorem.generateParagraphs(1),
    lorem.generateParagraphs(1)
];
const secondColText = [
    lorem.generateParagraphs(1),
    lorem.generateParagraphs(1),
    lorem.generateParagraphs(1)
];

export default function SplitPaneTest() {
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
                        {firstColText.map((text, i) => <p key={i}>{text}</p>)}
                    </div>
                    <div className={css.column}>
                        {secondColText.map((text, i) => <p key={i}>{text}</p>)}
                    </div>
                </SplitPane>
            </div>
        </div>
    );
}
