import {LoremIpsum} from 'lorem-ipsum';

import {SplitContainer} from '../../../components';

import css from './split-container.scss';

export default function SplitContainerTest() {
    const lorem = new LoremIpsum({});
    
    return (
        <div className={css['split-container-test']}>
            <SplitContainer>
                <div>
                    <p>{lorem.generateParagraphs(1)}</p>
                    <p>{lorem.generateParagraphs(1)}</p>
                    <p>{lorem.generateParagraphs(1)}</p>
                </div>
                <div>
                    <p>{lorem.generateParagraphs(1)}</p>
                    <p>{lorem.generateParagraphs(1)}</p>
                    <p>{lorem.generateParagraphs(1)}</p>
                </div>
            </SplitContainer>
        </div>
    );
}
