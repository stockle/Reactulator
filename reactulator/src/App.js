import React, { Component } from 'react';
import Graph from './Graph';
import './App.css';

const operators = {
  '+': (l, r) => {return l + r},
  '-': (l, r) => {return l - r},
  '*': (l, r) => {return l * r},
  '/': (l, r) => {return l / r}
};

class App extends Component {
  separateFunction(func) {
    return func.split(/(?<=[-+])|(?=[-+])/);
  }
  
  processValue(value, vals) {
    if (!isNaN(value)) {
      this.value_stack.push(parseFloat(value));
    } else if (value in operators) {
      this.operator_stack.push(value);
    } else if (value === "x") {
      this.value_stack.push(parseFloat(vals.xval));
    } else if (value === "y") {
      this.value_stack.push(parseFloat(vals.yval));
    } else {
      throw "NaN | NaO: " + value;
    }
  }

  resolveStacks() {
    let value = 0;

    while (this.operator_stack.length) {
      let right = this.value_stack.pop();
      let left = this.value_stack.pop();
      let op = this.operator_stack.pop();
      value += operators[op](left, right);
    }

    return value;
  }

  processFunction(list, vals) {
    let value = 0;

    while (list.length) {
      let values = list.pop();
      let value_set = values.split(/(?<=[*/])|(?=[*/])/);

      for (let i = 0; i < value_set.length; i++) {
        this.processValue(value_set[i].trim(), vals);
      }

      if (this.value_stack.length > 1) {
        value = this.resolveStacks();
        this.value_stack.push(value);
      } else if (this.value_stack.length == 1) {
        value = this.value_stack[0];  
      }
    }

    this.value_stack = [];
    this.operator_stack = []
    return value;
  }

  deconstructEquation(vals) {
    let xf_list = this.separateFunction(this.state.x_function);
    let yf_list = this.separateFunction(this.state.y_function);

    let xv = this.processFunction(xf_list, vals);
    let yv = this.processFunction(yf_list, vals);

    return {xval: xv, yval: yv};
  }

  solveFunction() {
    var data = [];

    try {
      var xval = parseFloat(this.state.x_value);
      var yval = parseFloat(this.state.y_value);
      var vals = {xval, yval};

      for (var i = this.state.iterations; i >= 0; i--) {
        data.push(vals);
        vals = this.deconstructEquation(vals);
      }
    } catch (e) {
      console.log("Error in number parsing: ", e);
    } finally {
      this.value_stack = [];
      this.operator_stack = [];
      this.setState({
        data: data
      })
    }
  }

  handleXFunctionChange(e) {
    this.setState({
      x_function: e.target.value
    });
  }

  handleYFunctionChange(e) {
    this.setState({
      y_function: e.target.value
    });
  }

  handleXValueChange(e) {
    this.setState({
      x_value: e.target.value
    });
  }

  handleYValueChange(e) {
    this.setState({
      y_value: e.target.value
    });
  }

  handleIterationsChange(e) {
    this.setState({
      iterations: e.target.value
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          REACTULATOR!
        </div>
        <div>
          <Graph data={this.data}/>

          <input
            type="text"
            pattern="[0-9]*"
            value={this.state.x_value}
            onChange={(e) => {this.handleXValueChange(e)}}
          />

          <input
            type="text"
            pattern="[0-9]*"
            value={this.state.y_value}
            onChange={(e) => {this.handleYValueChange(e)}}
          />
       
          <br/>

          <input
            type="text"
            value={this.state.x_function}
            onChange={(e) => {this.handleXFunctionChange(e)}}
          />

          <input
            type="text"
            value={this.state.y_function}
            onChange={(e) => {this.handleYFunctionChange(e)}}
          />

          <br/>

          <button onClick={this.solveFunction.bind(this)}>REACTULATE!</button>

          <input
            type="text"
            pattern="[0-9]*"
            onChange={(e) => {this.handleIterationsChange(e)}}
            value={this.state.iterations}
          />
        </div>
      </div>
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      iterations: 1,

      x_function: "x",
      y_function: "y",

      x_value: 0,
      y_value: 0,

      data: [{x:0, y:0}]
    };

    this.value_stack = [];
    this.operator_stack = [];
  }
}

export default App;
