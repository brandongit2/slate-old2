import React from 'react';
import {connect} from 'react-redux';
import {generate} from 'shortid';

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
        return (
            <Layout title="Slate"
                    className={css.layout}
                    style={{
                        color: '#ddd'
                    }}>
                <div id={css.container}>
                    <div id={css['info-box']}>
                        <span>What would you like to learn today?</span>
                    </div>
                    <div id={css.courses}>
                        {this.props.courses.map(course => (
                            <CourseCard key={generate()}
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
