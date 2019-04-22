import axios from 'axios';
import React from 'react';
import Link from 'next/link';

import {Layout, ContentContainer, ContentBox} from '../components';
import {InfoSection, ContentSection} from '../components/ContentContainer';

import css from './subjects.scss';

export default function Subjects(props) {
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
                                                    color={props.theme === 'light' ? '#222222' : '#888888'} />
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

Subjects.getInitialProps = async () => {
    return {
        subjects: (await axios.get('/api/all-subjects')).data
    };
};
