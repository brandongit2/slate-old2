import {connect} from 'react-redux';

import {getAllSubjects, changeSubject, changeCourse, changeUnit, changeArticle} from '../actions';
import {Layout, ContentContainer, InfoSection, ContentSection} from '../components';

import css from './subjects.scss';

function Subjects(props) {
    return (
        <Layout title="Subjects - Slate">
            <ContentContainer color="#222222">
                <InfoSection title="Subjects"
                             description="Pick a subject to start learning!" />
                <ContentSection>
                    <div className={css['content-section']}>
                        {props.subjects.map(subject => (
                            <p key={subject.id}>{subject.display_name}</p>
                        ))}
                    </div>
                </ContentSection>
            </ContentContainer>
        </Layout>
    );
}

Subjects.getInitialProps = async ({store}) => {
    await store.dispatch(changeSubject(null));
    await store.dispatch(changeCourse(null));
    await store.dispatch(changeUnit(null));
    await store.dispatch(changeArticle(null));
    await store.dispatch(getAllSubjects());
};

function mapStateToProps(state) {
    return {
        subjects: state.subjects
    };
}

export default connect(mapStateToProps)(Subjects);
