import React, {Component} from 'react';

import dots from './dots.mock';

class MapContainer extends Component {
  dotSize = 5;
  offsetX = 0;
  offsetY = 0;
  isCaptured = false;
  canvasSize = {
    width: 600,
    height: 600
  };
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
    this.draw(0, 0);
  };

  getLimitPositions = (left, top) => {
    const {mapSize} = this;

    if (left >= 0) {
      left = 0;
    }

    if (top >= 0) {
      top = 0;
    }

    if (Math.abs(left) >= mapSize.width - this.refs.canvas.width) {
      left = -(mapSize.width - this.refs.canvas.width);
    }
    if (Math.abs(top) >= mapSize.height - this.refs.canvas.height) {
      top = -(mapSize.height - this.refs.canvas.height);
    }

    return {
      left,
      top
    }
  };

  getMapSize = () => {
    return dots.reduce((acc, dot) => {
      return {
        width: dot.x > acc.width ? dot.x + this.dotSize * 2 : acc.width,
        height: dot.y > acc.height ? dot.y + this.dotSize * 2 : acc.height
      }
    }, {width: this.canvasSize.width, height: this.canvasSize.height})
  };

  draw = (left, top) => {
    const {
      dotSize,
      canvasCtx,
      mapSize,
      refs: {canvas},
    } = this;

    const offset = this.getLimitPositions(left, top);

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.setTransform(1, 0, 0, 1, 0, 0);
    canvasCtx.translate(offset.left, offset.top);

    canvasCtx.fillStyle = 'yellow';
    canvasCtx.fillRect(0, 0, mapSize.width, mapSize.height);

    dots.forEach((dot) => {
      canvasCtx.beginPath();
      canvasCtx.arc(dot.x, dot.y, dotSize, 0, 2 * Math.PI);
      canvasCtx.stroke();
    });
  };

  onMouseDown = (event) => {
    this.isCaptured = true;
    this.offsetX = event.pageX;
    this.offsetY = event.pageY;
  };

  onMouseUp = (event) => {
    this.isCaptured = false;
    const left = this.state.left + event.pageX - this.offsetX;
    const top = this.state.top + event.pageY - this.offsetY;
    const offset = this.getLimitPositions(left, top);

    this.setState({
      left: offset.left,
      top: offset.top
    });

    this.offsetX = 0;
    this.offsetY = 0;
  };

  onMouseMove = (event) => {
    if (this.isCaptured) {
      const left = this.state.left + event.pageX - this.offsetX;
      const top = this.state.top + event.pageY - this.offsetY;
      this.draw(left, top);
    }
  };

  render() {
    return (
      <div>
        <p>
          left: <strong>{this.state.left}px</strong>;

          top: <strong>{this.state.top}px</strong>;
        </p>
        <canvas
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
          onMouseDown={this.onMouseDown}
          ref="canvas"
          width={this.canvasSize.width}
          height={this.canvasSize.height}/>
      </div>
    )
  }
}

export default MapContainer;
