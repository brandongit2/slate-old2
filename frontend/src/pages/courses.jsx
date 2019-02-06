import React from 'react';
import {connect} from 'react-redux';

import {getCourses} from '../actions';
import {Layout} from '../components';
import {Subject} from '../components/landingPage';
import css from './courses.scss';

class Landing extends React.Component {
    componentDidMount() {
        this.props.getCourses();
    }

    render() {
        const {props} = this;
        return (
            <Layout title="Courses - Slate" className={css.layout}>
                <div id={css.container}>
                    <span id={css.prompt}>What would you like to learn today?</span>
                    <div id={css.courses}>
                        {props.subjects.map(subject => (
                            <Subject key={subject.name}
                                     name={subject.name}
                                     color={subject.color}
                                     courses={subject.courses.map(
                                         courseId => props.courses[courseId]
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
    getCourses: () => dispatch(getCourses())
});

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
