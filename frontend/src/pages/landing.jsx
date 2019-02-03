import React from 'react';
import {connect} from 'react-redux';

import {getCourses} from '../actions';
import {Layout} from '../components';
import {CourseCard, DotsBackground} from '../components/landingPage';
import {colors} from '../config.json';
import css from './landing.scss';

class Landing extends React.Component {
    state = {
        currentCourse: 'none'
    };

    componentDidMount() {
        history.replaceState({}, '', '/');
        this.props.getCourses();
    }

    handleHover = course => {
        this.setState({
            currentCourse: course
        });
    };

    handleLeave = () => {
        this.setState({
            currentCourse: 'none'
        });
    }

    render() {
        const currentCourse = this.props.courses.filter(course => course.name === this.state.currentCourse)[0];
        return (
            <Layout title="Slate"
                    className={css.layout}>
                <div id={css.container}>
                    <div id={css['info-box']}>
                        <div id={css['prompt-container']}>
                            <span id={css.prompt}>What would you like to learn today?</span>
                        </div>
                        <div id={css.info} className={this.state.currentCourse === 'none' ? css.hidden : ''}>
                            {this.state.currentCourse !== 'none'
                                ? (
                                    <React.Fragment>
                                        <span id={css.title}>{currentCourse.name}</span>
                                        <p id={css.description}>{currentCourse.description}</p>
                                    </React.Fragment>
                                ) : null
                            }

                        </div>
                    </div>
                    <div id={css.courses}>
                        {this.props.courses.map(course => (
                            <CourseCard key={course.name}
                                        name={course.name}
                                        description={course.description}
                                        onHover={this.handleHover}
                                        onLeave={this.handleLeave} />
                        ))}
                    </div>
                </div>
                <DotsBackground color={colors[this.state.currentCourse].main} />
            </Layout>
        );
    }
}

const mapStateToProps = state => ({
    courses: state.courses
});

const mapDispatchToProps = dispatch => ({
    getCourses: () => dispatch(getCourses())
});

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
