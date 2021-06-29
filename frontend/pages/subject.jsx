import axios from 'axios';
import Link from 'next/link';
import {withRouter} from 'next/router';
import React from 'react';

import {Layout, Breadcrumbs, Dropdown, ContentContainer, ContentBox} from '../components';
import {Crumb} from '../components/Breadcrumbs';
import {InfoSection, ContentSection} from '../components/ContentContainer';
import {Item} from '../components/Dropdown';

import css from './subject.scss';

function Subject(props) {
    const [currentCourses, setCurrentCourses] = React.useState(props.courses);
    const [currentSubject, changeSubject] = React.useReducer((oldSubject, newSubjectId) => {
        axios.get(`http://localhost:3001/api/children?subject=${newSubjectId}`, {withCredentials: true})
            .then(courses => setCurrentCourses(courses.data));
        return props.subjects.find(subject => subject.id === newSubjectId);
    }, props.subjects.find(subject => subject.id === parseInt(props.router.query.subject)));
    
    return (
        <Layout title={currentSubject.display_name + ' - Slate'}>
            <ContentContainer color={`#${currentSubject.color}`}>
                <InfoSection breadcrumbs={(
                                 <div className={css.breadcrumbs}> {/* eslint-disable-line react/jsx-indent */}
                                     <Breadcrumbs>
                                         <Crumb>
                                             <Link href="/subjects"><a>Subjects</a></Link>
                                         </Crumb>
                                         <Crumb>
                                             <Dropdown mini label={currentSubject.display_name}>
                                                 {props.subjects.map(subject => (
                                                     <Item key={subject.id}
                                                           onClick={() => {
                                                               changeSubject(subject.id);
                                                               
                                                               const url = `/subject/${subject.name}`;
                                                               const as = url;
                                                               const options = {};
                                                               window.history.pushState({url, as, options}, null, url);
                                                           }}>{subject.display_name}</Item>
                                                   ))}
                                             </Dropdown>
                                         </Crumb>
                                     </Breadcrumbs>
                                 </div>
                             )}
                             type="Subject"
                             title={currentSubject.display_name}
                             description={currentSubject.description} />
                <ContentSection>
                    <main className={css['course-list']}>
                        <p id={css['courses-title']}>Courses</p>
                        {currentCourses.map(course => (
                            <Link key={course.id}
                                  href={`/course?subject=${currentSubject.id}&course=${course.id}`}
                                  as={`/subject/${currentSubject.name}/${course.name}`}>
                                <a>
                                    <ContentBox title={course.display_name}
                                                description={course.description}
                                                color={`#${currentSubject.color}`} />
                                </a>
                            </Link>
                        ))}
                    </main>
                </ContentSection>
            </ContentContainer>
        </Layout>
    );
}

Subject.getInitialProps = async ctx => ({
    subjects: (await axios.get('http://localhost:3001/api/all-subjects', {withCredentials: true})).data,
    courses:  (await axios.get(`http://localhost:3001/api/children?subject=${ctx.query.subject}`, {withCredentials: true})).data
});

export default withRouter(Subject);
