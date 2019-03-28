import {ContentContainer, ContentSection, InfoSection, Layout} from '../../components';

import css from './content-container.scss';

export default function ContentContainerTest(props) {
    return (
        <Layout title="Content Container - Slate Testing">
            <ContentContainer color={props.color}>
                <InfoSection type="Test"
                             title="Content Container Test"
                             description="This is a description haha" />
                <ContentSection>
                    <div className={css['content-section']}>
                        <h1>Title</h1>
                        <p>
                            content section
                        </p>
                    </div>
                </ContentSection>
            </ContentContainer>
        </Layout>
    );
}

ContentContainerTest.defaultProps = {
    color: '#af5555'
};
