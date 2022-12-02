import React from 'react';
import Synth from '../Synth/';
import Sequencer from '../Sequencer/';
import './style.css';

const Main = (props) => {
  return (
    <div className="msblock">
      <h3>matrix sequencer</h3>
      <Sequencer />
      <Synth />
    </div>
  );
};

export default Main;
