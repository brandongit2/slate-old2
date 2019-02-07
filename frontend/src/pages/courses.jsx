import React from 'react';
import {connect} from 'react-redux';

import {changeSubject, changeCourse} from '../actions';
import {Layout} from '../components';
import {Subject} from '../components/landingPage';
import css from './courses.scss';

class Courses extends React.Component {
    componentDidMount() {
        this.props.changeSubject(null);
        this.props.changeCourse(null);
    }

    render() {
        const {props} = this;
        return (
            <Layout currentPage="courses"
                    title="Courses - Slate"
                    className={css.layout}>
                <div id={css.container}>
                    <span id={css.prompt}>What would you like to learn today?</span>
                    <div id={css.courses}>
                        {Object.entries(props.subjects).map(entry => (
                            <Subject key={entry[1].name}
                                     id={entry[0]}
                                     name={entry[1].name}
                                     color={entry[1].color}
                                     courses={entry[1].courses.map(
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

const mapDispatchToProps = dispatch => ({
    changeSubject: newSubject => dispatch(changeSubject(newSubject)),
    changeCourse:  newCourse => dispatch(changeCourse(newCourse))
});

export default connect(mapStateToProps, mapDispatchToProps)(Courses);
