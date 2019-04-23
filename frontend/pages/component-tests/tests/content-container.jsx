import {ContentContainer} from '../../../components';
import {ContentSection, InfoSection} from '../../../components/ContentContainer';

import css from './content-container.scss';

export default function ContentContainerTest(props) {
    return (
        <div className={css['content-container-test']}>
            <ContentContainer color={props.color}>
                <InfoSection type="Test"
                             title="Content Container Test"
                             description="This is a description" />
                <ContentSection>
                    <div className={css['content-section']}>
                        <h1>Title</h1>
                        <p>
                            content section
                        </p>
                    </div>
                </ContentSection>
            </ContentContainer>
        </div>
    );
}

ContentContainerTest.defaultProps = {
    color: '#af5555'
};
