import React from 'react';
import {connect} from 'react-redux';

import {changeSubject, changeCourse, getAllSubjects, getAllCourses} from '../actions';
import {Layout} from '../components';
import {Subject} from '../components/landingPage';
import css from './subjects.scss';

class Courses extends React.Component {
    static async getInitialProps({store}) {
        await store.dispatch(getAllSubjects());
        await store.dispatch(getAllCourses());
        await store.dispatch(changeSubject(null));
        await store.dispatch(changeCourse(null));
    }

    render() {
        const {props} = this;
        return (
            <Layout currentPage="subjects"
                    title="Subjects - Slate"
                    className={css.layout}>
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
            </Layout>
        );
    }
}

const mapStateToProps = state => ({
    courses:  state.courses,
    subjects: state.subjects
});

export default connect(mapStateToProps)(Courses);
