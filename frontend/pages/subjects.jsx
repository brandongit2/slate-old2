import Link from 'next/link';
import {connect} from 'react-redux';

import {getAllSubjects, changeSubject, changeCourse, changeUnit, changeArticle} from '../actions';
import {Layout, ContentContainer, InfoSection, ContentSection, ContentBox} from '../components';

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
                            <div className={css.subject} key={subject.id}>
                                <Link href={`/subject/${subject.name}`}>
                                    <a>
                                        <ContentBox title={subject.display_name}
                                                    description={subject.description}
                                                    color="#222222" />
                                    </a>
                                </Link>
                            </div>
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
