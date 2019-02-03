import React from 'react';

import {Layout} from '../components';
import {CourseCard} from '../components/landingPage';
import {colors} from '../config.json';
import css from './landing.scss';

export default class Landing extends React.Component {
    state = {
        currentSubject: 'math'
    };

    componentDidMount() {
        history.replaceState({}, '', '/');
    }

    render() {
        let currentColors = colors[this.state.currentSubject];
        return (
            <Layout title="Slate"
                    className={css.layout}
                    style={{
                        background: `linear-gradient(143deg, ${currentColors.bg1} 0%, ${currentColors.bg2} 100%)`,
                        color:      currentColors.text
                    }}>
                <div id={css.container}>
                    <div id={css['info-box']}>
                        <span>What would you like to learn?</span>
                    </div>
                    <div id={css.courses}></div>
                </div>
            </Layout>
        );
    }
}
