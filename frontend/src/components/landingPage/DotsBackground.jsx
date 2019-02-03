import React from 'react';

import css from './DotsBackground.scss';

const backgroundColor = '#111111';

export default class DotsBackground extends React.Component {
    prevColor = '#444444';
    windowWidth = 0;
    windowHeight = 0;

    constructor(props) {
        super(props);

        this.canvas = React.createRef();
    }

    componentDidMount() {
        window.addEventListener('resize', () => {
            this.windowWidth = window.innerWidth * window.devicePixelRatio;
            this.windowHeight = window.innerHeight * window.devicePixelRatio;
            this.canvas.current.width = this.windowWidth;
            this.canvas.current.height = this.windowHeight;

            this.clearBackground();
            this.drawDots(this.props.color, false);
        });
        this.windowWidth = window.innerWidth * window.devicePixelRatio;
        this.windowHeight = window.innerHeight * window.devicePixelRatio;
        this.canvas.current.width = this.windowWidth;
        this.canvas.current.height = this.windowHeight;

        this.ctx = this.canvas.current.getContext('2d');
        this.clearBackground();
        this.drawDots(this.props.color, false);
    }

    componentDidUpdate() {
        this.drawDots(this.props.color);
    }

    clearBackground = () => {
        this.ctx.fillStyle = backgroundColor;
        this.ctx.fillRect(0, 0, this.windowWidth, this.windowHeight);
    };

    drawDots = (color, animate = true) => {
        const center = [this.windowWidth / 2, this.windowHeight / 2];
        const dotRadius = 2.5 * window.devicePixelRatio;
        const dotDistance = 60 * window.devicePixelRatio;

        this.ctx.fillStyle = this.prevColor;
        let dotArray = [];
        for (let x = center[0] - Math.ceil(center[0] / dotDistance) * dotDistance; x < Math.ceil(this.windowWidth / dotDistance) * dotDistance; x += dotDistance) { // Horizontally
            dotArray.push([]);
            for (let y = center[1] - Math.ceil(center[1] / dotDistance) * dotDistance; y < Math.ceil(this.windowHeight / dotDistance) * dotDistance; y += dotDistance) { // Vertically
                dotArray[dotArray.length - 1].push([x, y]);
            }
        }

        this.prevColor = color;
        if (animate) {
            let i = 0;
            let interval = setInterval(() => {
                let x = 0, y = i;
                do {
                    try {
                        // Clear the previous circle
                        this.ctx.fillStyle = backgroundColor;
                        this.ctx.fillRect(dotArray[x][y][0] - 4, dotArray[x][y][1] - 4, 8, 8);

                        // Draw the new circle
                        this.ctx.fillStyle = color;
                        this.ctx.beginPath();
                        this.ctx.arc(...dotArray[x][y], dotRadius, 0, 2 * Math.PI);
                        this.ctx.fill();
                    } catch {}
                } while (++x <= i && --y >= 0);
                if (++i > Math.max(dotArray.length, dotArray[0].length) * 2) clearInterval(interval);
            }, 10);
        } else {
            for (let x = 0; x < dotArray.length; x++) {
                for (let y = 0; y < dotArray[0].length; y++) {
                    // Clear the previous circle
                    this.ctx.fillStyle = backgroundColor;
                    this.ctx.fillRect(dotArray[x][y][0] - 4, dotArray[x][y] - 4, 8, 8);

                    // Draw the new circle
                    this.ctx.fillStyle = color;
                    this.ctx.beginPath();
                    this.ctx.arc(...dotArray[x][y], dotRadius, 0, 2 * Math.PI);
                    this.ctx.fill();
                }
            }
        }
    };

    render() {
        return (
            <canvas id={css.canvas} ref={this.canvas} />
        );
    }
}
