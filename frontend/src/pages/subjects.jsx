import moment from 'moment';
import React from 'react';
import {connect} from 'react-redux';

import {changeSubject, changeCourse, getAllSubjects, getAllCourses, setInfo} from '../actions';
import {Layout} from '../components';
import {Subject} from '../components/landingPage';
import css from './subjects.scss';

class Courses extends React.Component {
    static async getInitialProps({store}) {
        await store.dispatch(getAllSubjects());
        await store.dispatch(getAllCourses());
        await store.dispatch(changeSubject(null));
        await store.dispatch(changeCourse(null));
        await store.dispatch(setInfo({
            version:     process.env.SLATE_VERSION,
            publishDate: process.env.SLATE_PUBLISH_DATE
        }));
    }

    render() {
        const {props} = this;
        return (
            <Layout currentPage="subjects"
                    title="Subjects - Slate"
                    className={css.layout}
                    noShadow>
                <div id={css.container}>
                    <span id={css.prompt}>What would you like to learn today?</span>
                    <div id={css.courses}>
                        {Object.entries(props.subjects).map(([id, subject]) => (
                            <Subject key={id}
                                     id={id}
                                     name={subject.name}
                                     color={subject.color}
                                     courses={subject.courses.map(
                                         courseId => ({id: courseId, ...props.courses[courseId]})
                                     )} />
                             ))}
                    </div>
                </div>
                <div id={css.footer}>
                    <span>{props.info.version && props.info.publishDate
                        ? `Slate version ${props.info.version} published on ${moment.unix(props.info.publishDate).format('MMMM Do, YYYY')}.`
                        : props.info.version
                            ? `Slate version ${props.info.version}.`
                            : ''
                    }</span> {/* eslint-disable-line react/jsx-closing-tag-location */}
                    <span style={{float: 'right'}}>Made by <a href="https://github.com/brandongit2">Brandon Tsang</a>.</span>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps = state => ({
    courses:  state.courses,
    subjects: state.subjects,
    info:     state.info
});

export default connect(mapStateToProps)(Courses);
