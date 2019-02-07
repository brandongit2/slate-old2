import {withRouter} from 'next/router';
import React from 'react';
import {connect} from 'react-redux';

import {changeCourse} from '../actions';
import {Layout} from '../components';
import {kebabToProper} from '../util';

import css from './course.scss';

class Course extends React.Component {
    static getInitialProps({store, query}) {
        return store.dispatch(changeCourse(query.course));
    }

    render() {
        const {props} = this;
        const currentCourse = this.props.courses[props.router.query.course];
        return (
            <Layout currentPage=""
                    title={`${kebabToProper(currentCourse.name)} - Slate`}>
                <style jsx>{`
                    --color: #${currentCourse.color};
                `}</style> {/* eslint-disable-line react/jsx-closing-tag-location */}
                <div id={css.container}>
                    <header>
                        <p id={css['label-courses']}>COURSE</p>
                        <p id={css.title}>{kebabToProper(currentCourse.name)}</p>
                    </header>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps = state => ({
    currentCourse: state.currentCourse,
    courses:       state.courses
});

export default withRouter(connect(mapStateToProps)(Course));
