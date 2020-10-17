/*
https://codeburst.io/simple-data-visualization-with-react-js-svg-line-chart-tutorial-df12e5843ce
*/

import React, { Component } from 'react';

class Graph extends Component {
	drawPath() {
		const {data, color} = this.props;
		console.log(data);
		let pathD = "M"
			+ this.getSvgX(data[0].x)
			+ " "
			+ this.getSvgY(data[0].y)
			+ " ";

		pathD += data.map((point, i) => {
			return (
				"L"
				+ this.getSvgX(point.x)
				+ " "
				+ this.getSvgY(point.y)
				+ " "
			);
		}).join(' ');

		console.log(pathD);

		return (
			<path
				d={pathD}
				style={{
					stroke: color,
					strokeWidth:2,
					fill: "url(#paint0_linear)"
				}}
			/>
		);
	}
	
	drawAxis() {
		const {color} = this.props;
		const minX = this.getMinX(), maxX = this.getMaxX();
		const minY = this.getMinY(), maxY = this.getMaxY();
		console.log(minX, minY, maxX, maxY);

		return (
			<g>
				<line
					x1={this.getSvgX(minX)} y1={this.getSvgY(minY)}
					x2={this.getSvgX(maxX)} y2={this.getSvgY(minY)}
					style={{
						stroke:color,
						strokeWidth:2
					}}
				/>

				<line
					x1={this.getSvgX(minX)} y1={this.getSvgY(minY)}
					x2={this.getSvgX(minX)} y2={this.getSvgY(maxY)}
					style={{
						stroke:color,
						strokeWidth:2
					}}
				/>
			</g>
		);
	}

	render() {
		const {svgHeight, svgWidth} = this.props;

		return (
			<svg viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
				{this.drawAxis()}
				{this.drawPath()}
			</svg>
		);
	}

	getSvgX(x) {
		const {svgWidth} = this.props;
		return (x / (this.getMaxX() + 1) * svgWidth);
	}
	getSvgY(y) {
		const {svgHeight} = this.props;
		return svgHeight - (y / (this.getMaxY() + 1) * svgHeight);
	}

	getXs() {
	    const {data} = this.props;
	    return data.map(d => d.x);
	}
	getMinX() {
	    return Math.min(...this.getXs());
	}

	getMaxX() {
	    return Math.max(...this.getXs());
	}

	getYs() {
	    const {data} = this.props;
	    return data.map(d => d.y); 
	}
	getMinY() {
	    return Math.min(...this.getYs());
	}
	getMaxY() {
	    return Math.max(...this.getYs());
	}
}

Graph.defaultProps = {
  data: [
  	{x:1, y:1},
  	{x:2, y:2},
  	{x:4, y:3},
  	{x:7, y:4},
  	{x:11, y:5},
  	{x:16, y:6}
  ],
  color: '#2196F3',
  svgHeight: 300,  
  svgWidth: 700
}

export default Graph;