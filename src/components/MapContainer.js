import React, {Component} from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import dots from './dots.mock';

class MapContainer extends Component {
  dotSize = 5;
  step = 50;
  state = {
    top: 0,
    left: 0
  };

  componentDidMount() {
    this.initCanvas();
  };

  initCanvas = () => {
    this.canvasCtx = this.refs.canvas.getContext("2d");
    this.mapSize = this.getMapSize();

    this.onMoveHandler(this.state.top, this.state.left);
  };

  getMapSize = () => {
    return dots.reduce((acc, dot) => {
      return {
        width: dot.x > acc.width ? dot.x : acc.width,
        height: dot.y > acc.height ? dot.y : acc.height
      }
    }, {width: 0, height: 0})
  };

  draw = (top, left) => {
    const {
      dotSize,
      canvasCtx,
      mapSize,
      refs: {canvas},
    } = this;

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.setTransform(1, 0, 0, 1, 0, 0);
    canvasCtx.translate(left, top);

    canvasCtx.fillStyle = 'yellow';
    canvasCtx.fillRect(0, 0, mapSize.width, mapSize.height);

    dots.forEach((dot) => {
      canvasCtx.beginPath();
      canvasCtx.arc(dot.x, dot.y, dotSize, 0, 2 * Math.PI);
      canvasCtx.stroke();
    });
  };

  onMoveHandler = (direction) => {
    let {left, top} = this.state;

    switch (direction) {
      case 'left':
        if (left <= -this.step)
          left += this.step;
        break;
      case 'up':
        if (top <= -this.step)
          top += this.step;
        break;
      case 'right':
        if (Math.abs(left) < this.mapSize.width - this.refs.canvas.width) {
          left -= this.step;
        }
        break;
      case 'down':
        if (Math.abs(top) < this.mapSize.height - this.refs.canvas.height) {
          top -= this.step;
        }
        break;
    }

    this.setState({
      left,
      top
    }, () => {
      this.draw(top, left);
    });
  };

  render() {
    return (
      <div>
        <KeyboardEventHandler
          handleKeys={['up', 'down', 'left', 'right']}
          onKeyEvent={this.onMoveHandler}
        />
        <p>
          left: <strong>{this.state.left}px</strong>;

          top: <strong>{this.state.top}px</strong>;
        </p>
        <canvas ref="canvas" width="400" height="400"/>
        <p>Move map with arrow keys</p>
      </div>
    )
  }
}

export default MapContainer;
