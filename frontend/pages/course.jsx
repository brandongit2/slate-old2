import axios from 'axios';
import Link from 'next/link';
import {withRouter} from 'next/router';
import React from 'react';

import {Layout, Breadcrumbs, Dropdown, ContentContainer} from '../components';
import {Crumb} from '../components/Breadcrumbs';
import {Item} from '../components/Dropdown';
import {InfoSection, ContentSection} from '../components/ContentContainer';

import css from './course.scss';

function Course(props) {
    const [currentUnits, setCurrentUnits] = React.useState(props.units);
    const [currentArticles, setCurrentArticles] = React.useState(props.articles);
    const [currentCourse, changeCourse] = React.useReducer((oldCourse, newCourseId) => {
        axios.get(`/api/children?course=${newCourseId}`)
            .then(units => setCurrentUnits(units.data));
        axios.get(`/api/children?want=articles&course=${newCourseId}`)
            .then(articles => setCurrentArticles(articles.data));
        return props.courses.find(course => course.id === newCourseId);
    }, props.courses.find(course => course.id === parseInt(props.router.query.course)));
    
    return (
        <Layout title={`${currentCourse.display_name} - Slate`}>
            <ContentContainer color={`#${props.subject.color}`}>
                <InfoSection breadcrumbs={(
                                 <div className={css.breadcrumbs}> {/* eslint-disable-line react/jsx-indent */}
                                     <Breadcrumbs>
                                         <Crumb>
                                             <Link href="/subjects">
                                                 <a>Subjects</a>
                                             </Link>
                                         </Crumb>
                                         <Crumb>
                                             <Link href={`/subject/${props.subject.name}`}>
                                                 <a>{props.subject.display_name}</a>
                                             </Link>
                                         </Crumb>
                                         <Crumb>
                                             <Dropdown mini label={currentCourse.display_name}>
                                                 {props.courses.map(course => (
                                                     <Item key={course.id}
                                                           onClick={() => {
                                                               changeCourse(course.id);
                                                               
                                                               const url = `/subject/${props.subject.name}/${course.name}`;
                                                               const as = url;
                                                               const options = {};
                                                               window.history.pushState({url, as, options}, null, url);
                                                           }}>
                                                         {course.display_name}
                                                     </Item>
                                                 ))}
                                             </Dropdown>
                                         </Crumb>
                                     </Breadcrumbs>
                                 </div>
                             )}
                             type="Course"
                             title={currentCourse.display_name}
                             description={currentCourse.description} />
                <ContentSection>
                    <main className={css['content-section']}>
                        <p id={css['units-title']}>Units</p>
                        {currentUnits.map(unit => (
                            <div key={unit.id} className={css['article-list']}>
                                <div id={css['unit-header']}>
                                    <span className={css['unit-number']}>Unit {unit.order}</span>
                                    <span>{unit.display_name}</span>
                                </div>
                                <div id={css.list}>
                                    {currentArticles.map(article => {
                                        if (article.unit_id === unit.id) {
                                            return (
                                                <Link key={article.id}
                                                      href={
                                                          `/article?subject=${props.subject.id}&course=${currentCourse.id}&unit=${unit.id}&article=${article.id}`
                                                      }
                                                      as={
                                                          `/subject/${props.subject.name}/${currentCourse.name}/${article.title}`
                                                      }>
                                                    <a>{article.display_title}</a>
                                                </Link>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        ))}
                    </main>
                </ContentSection>
            </ContentContainer>
        </Layout>
    );
}

Course.getInitialProps = async ctx => ({
    subject:  (await axios.get(`/api/subject/${ctx.query.subject}`)).data[0],
    courses:  (await axios.get(`/api/children?subject=${ctx.query.subject}`)).data,
    units:    (await axios.get(`/api/children?course=${ctx.query.course}`)).data,
    articles: (await axios.get(`/api/children?want=articles&course=${ctx.query.course}`)).data
});

export default withRouter(Course);
