import React, { Component } from 'react';
import GridComponent from './components/GridComponent';
import StageButtons from './components/StageButtons';

class App extends Component {
  render() {
    return (
      <div className="App">
        <StageButtons />
        <GridComponent />
      </div>
    );
  }
}

export default App;
