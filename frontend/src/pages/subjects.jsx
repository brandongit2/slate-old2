import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import React from 'react';
import {connect} from 'react-redux';

import {changeSubject, changeCourse, changeUnit, changeArticle, getAllSubjects, getChildren} from '../actions';
import {Layout} from '../components';
import css from './subjects.scss';

class Subject extends React.Component {
    state = {
        courses: []
    }
    
    constructor(props) {
        super(props);
        
        props.courses?.then(courses => this.setState({courses: courses.data})); /* eslint-disable-line no-unused-expressions */
    }
    
    render() {
        const {props} = this;
        return (
            <div className={css.subject}>
                <style jsx>{`
                    --color: #${props.color}
                `}</style>
                <Link href={`/subject?subject=${props.id}`}
                      as={`/subject/${props.name}`}>
                    <a className={css.title}>
                        {props.displayName}
                    </a>
                </Link>
                {this.state.courses.map(course => (
                    <Link key={course.name}
                          href={`/course?course=${course.id}`}
                          as={`/subject/${props.name}/${course.name}`}>
                        <a className={css.course}>
                            {course.display_name}
                        </a>
                    </Link>
                ))}
            </div>
        );
    }
}

Subject.defaultProps = {
    name:    '',
    color:   '888888',
    courses: []
};

function Subjects(props) {
    return (
        <Layout currentPage="subjects" title="Subjects - Slate" noShadow>
            <div id={css.container}>
                <span id={css.prompt}>What would you like to learn today?</span>
                <div id={css.courses}>
                    {props.subjects.map(subject => (
                        <Subject key={subject.id}
                                 id={subject.id}
                                 name={subject.name}
                                 displayName={subject.display_name}
                                 color={subject.color}
                                 courses={axios.get('/api/children?subject=' + subject.id)} />
                    ))}
                </div>
            </div>
            <div id={css.footer}>
                <span>{props.info.version && props.info.publishDate
                    ? `Slate version ${props.info.version} published on ${moment.unix(props.info.publishDate).format('MMMM Do, YYYY')}.`
                    : props.info.version
                        ? `Slate version ${props.info.version}.`
                        : ''
                }</span>
                <span style={{float: 'right'}}>
                    Made by <a href="https://github.com/brandongit2">Brandon Tsang</a>.
                </span>
            </div>
        </Layout>
    );
}

Subjects.getInitialProps = async ({store}) => {
    await store.dispatch(changeSubject(null));
    await store.dispatch(changeCourse(null));
    await store.dispatch(changeUnit(null));
    await store.dispatch(changeArticle(null));
    await store.dispatch(getAllSubjects());
};

function mapStateToProps(state) {
    return {
        subjects: state.subjects,
        info:     state.info
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getCoursesBySubject: subjectId => dispatch(getChildren('subject', subjectId))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Subjects);
